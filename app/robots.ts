import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://reev.dev";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs/"],
        disallow: ["/api/", "/reports/", "/patterns/", "/flows/", "/settings/", "/projects/", "/setup/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
