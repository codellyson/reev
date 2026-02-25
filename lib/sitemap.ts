export interface SitemapTreeNode {
  path: string;
  segment: string;
  label: string;
  children: SitemapTreeNode[];
  isPage: boolean;
}

/**
 * Extract all <loc>...</loc> values from sitemap XML.
 * Sitemap XML is rigidly standardized — regex extraction is reliable.
 */
export function extractLocs(xml: string): string[] {
  const locs: string[] = [];
  const regex = /<loc>\s*(.*?)\s*<\/loc>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    locs.push(match[1].trim());
  }
  return locs;
}

/** Detect whether the XML is a sitemap index (<sitemapindex>) vs a regular urlset */
export function isSitemapIndex(xml: string): boolean {
  return /<sitemapindex[\s>]/i.test(xml);
}

/**
 * Convert a URL path segment to a human-readable label.
 * "order-history" → "Order History"
 */
export function generateLabel(segment: string): string {
  if (!segment) return "Home";
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Generate a hierarchical label from a full pathname.
 * "/" → "Home"
 * "/docs" → "Docs"
 * "/docs/api-reference" → "Docs > Api Reference"
 */
export function pathToLabel(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";
  return segments.map((s) => generateLabel(s)).join(" > ");
}

/**
 * Build a tree hierarchy from a flat list of URL pathnames.
 * Intermediate directories that aren't in the original list are marked isPage: false.
 */
export function buildSitemapTree(paths: string[]): SitemapTreeNode {
  const pathSet = new Set(paths.map((p) => (p === "/" ? "/" : p.replace(/\/$/, ""))));

  const root: SitemapTreeNode = {
    path: "/",
    segment: "",
    label: "Home",
    children: [],
    isPage: pathSet.has("/"),
  };

  const sorted = [...pathSet].filter((p) => p !== "/").sort();

  for (const path of sorted) {
    const segments = path.split("/").filter(Boolean);
    let current = root;
    let currentPath = "";

    for (let i = 0; i < segments.length; i++) {
      currentPath += "/" + segments[i];
      let child = current.children.find((c) => c.segment === segments[i]);

      if (!child) {
        child = {
          path: currentPath,
          segment: segments[i],
          label: generateLabel(segments[i]),
          children: [],
          isPage: i === segments.length - 1 && pathSet.has(currentPath),
        };
        current.children.push(child);
      } else if (i === segments.length - 1) {
        child.isPage = true;
      }

      current = child;
    }
  }

  return root;
}
