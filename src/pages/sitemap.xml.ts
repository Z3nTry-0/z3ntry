import type { APIRoute } from "astro";

const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about/", changefreq: "monthly", priority: "0.8" },
  { path: "/contact/", changefreq: "yearly", priority: "0.6" },
] as const;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://z3ntry.com");
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map(({ path, changefreq, priority }) => [
      "  <url>",
      `    <loc>${new URL(path, base).href}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n"))
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
