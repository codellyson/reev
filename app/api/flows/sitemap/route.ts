import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import { extractLocs, isSitemapIndex, buildSitemapTree } from "@/lib/sitemap";

const MAX_URLS = 1000;
const MAX_CHILD_SITEMAPS = 10;
const FETCH_TIMEOUT = 10_000;

async function fetchWithTimeout(
  url: string,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "ReevBot/1.0" },
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Swap https↔http */
function altProtocol(url: string): string {
  if (url.startsWith("https://")) return url.replace("https://", "http://");
  if (url.startsWith("http://")) return url.replace("http://", "https://");
  return url;
}

function normalizeToPathname(url: string, origin: string): string | null {
  try {
    const parsed = new URL(url);
    const expected = new URL(origin);
    // Compare hostname + port only (ignore protocol differences)
    if (parsed.hostname !== expected.hostname) return null;
    if (parsed.port !== expected.port) {
      // Allow default port mismatch (443 vs 80 vs empty)
      const effectivePort = (p: URL) =>
        p.port || (p.protocol === "https:" ? "443" : "80");
      if (effectivePort(parsed) !== effectivePort(expected)) return null;
    }
    return parsed.pathname;
  } catch {
    if (url.startsWith("/")) return url;
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth(request);

    const projectId = request.nextUrl.searchParams.get("projectId");
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "projectId required" },
        { status: 400 }
      );
    }

    const project = await queryOne<{ id: string; website_url: string }>(
      `SELECT id, website_url FROM projects WHERE id = $1 AND user_id = $2`,
      [projectId, userId]
    );
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    if (!project.website_url) {
      return NextResponse.json(
        { success: false, error: "Project URL not configured" },
        { status: 400 }
      );
    }

    const baseUrl = project.website_url.replace(/\/$/, "");
    let sitemapUrl = `${baseUrl}/sitemap.xml`;
    let xml = "";

    // Try fetching sitemap.xml (try original protocol, then alternate)
    for (const url of [sitemapUrl, altProtocol(sitemapUrl)]) {
      if (xml) break;
      try {
        const res = await fetchWithTimeout(url, FETCH_TIMEOUT);
        if (res.ok) {
          xml = await res.text();
          sitemapUrl = url;
        }
      } catch {
        // Fetch failed, try next
      }
    }

    // Fallback: check robots.txt for Sitemap: directive
    if (!xml) {
      for (const robotsUrl of [
        `${baseUrl}/robots.txt`,
        `${altProtocol(baseUrl)}/robots.txt`,
      ]) {
        if (xml) break;
        try {
          const robotsRes = await fetchWithTimeout(robotsUrl, FETCH_TIMEOUT);
          if (robotsRes.ok) {
            const robotsTxt = await robotsRes.text();
            const match = robotsTxt.match(/^Sitemap:\s*(.+)$/im);
            if (match) {
              sitemapUrl = match[1].trim();
              const sitemapRes = await fetchWithTimeout(
                sitemapUrl,
                FETCH_TIMEOUT
              );
              if (sitemapRes.ok) {
                xml = await sitemapRes.text();
              }
            }
          }
        } catch {
          // robots.txt also unavailable
        }
      }
    }

    // No sitemap found — return empty tree
    if (!xml) {
      return NextResponse.json({
        success: true,
        data: {
          tree: {
            path: "/",
            segment: "",
            label: "Home",
            children: [],
            isPage: false,
          },
          totalUrls: 0,
          truncated: false,
          fetchedAt: new Date().toISOString(),
          sitemapUrl,
        },
      });
    }

    // Parse XML
    let allLocs: string[] = [];

    if (isSitemapIndex(xml)) {
      // Sitemap index — fetch child sitemaps
      const childUrls = extractLocs(xml).slice(0, MAX_CHILD_SITEMAPS);
      const childFetches = childUrls.map(async (childUrl) => {
        try {
          const res = await fetchWithTimeout(childUrl, FETCH_TIMEOUT);
          if (res.ok) {
            const childXml = await res.text();
            return extractLocs(childXml);
          }
        } catch {
          // Skip failed child sitemaps
        }
        return [];
      });
      const results = await Promise.all(childFetches);
      allLocs = results.flat();
    } else {
      allLocs = extractLocs(xml);
    }

    // Normalize to pathnames, filter to same origin, deduplicate
    const pathSet = new Set<string>();
    for (const loc of allLocs) {
      const pathname = normalizeToPathname(loc, baseUrl);
      if (pathname) {
        pathSet.add(pathname.replace(/\/$/, "") || "/");
      }
    }

    const totalUrls = pathSet.size;
    const truncated = totalUrls > MAX_URLS;

    // Cap at MAX_URLS
    const paths = [...pathSet].slice(0, MAX_URLS);
    const tree = buildSitemapTree(paths);

    return NextResponse.json({
      success: true,
      data: {
        tree,
        totalUrls,
        truncated,
        fetchedAt: new Date().toISOString(),
        sitemapUrl,
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error fetching sitemap:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sitemap" },
      { status: 500 }
    );
  }
}
