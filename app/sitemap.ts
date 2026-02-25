import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://reev.dev";
  const now = new Date();

  const publicPages: {
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly" | "monthly";
  }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" },
    { path: "/signup", priority: 0.6, changeFrequency: "monthly" },
    { path: "/docs", priority: 0.8, changeFrequency: "weekly" },
    { path: "/docs/getting-started", priority: 0.7, changeFrequency: "weekly" },
    { path: "/docs/configuration", priority: 0.7, changeFrequency: "weekly" },
    { path: "/docs/api-reference", priority: 0.7, changeFrequency: "weekly" },
    { path: "/docs/troubleshooting", priority: 0.6, changeFrequency: "monthly" },
  ];

  return publicPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
