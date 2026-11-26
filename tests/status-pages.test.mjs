import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { get as getHttp } from "node:http";
import { get as getHttps } from "node:https";
import test from "node:test";

const site = process.env.TEST_SITE_URL ?? "http://127.0.0.1:4321";
const vercel = process.env.TEST_VERCEL_ROUTING === "1";
const navigation = { Accept: "text/html", "Sec-Fetch-Mode": "navigate" };

function request(path, { headers } = {}) {
  const url = new URL(path, site);
  const get = url.protocol === "https:" ? getHttps : getHttp;
  return new Promise((resolve, reject) => {
    get(url, { headers }, (response) => {
      response.setEncoding("utf8");
      let text = "";
      response.on("data", (chunk) => { text += chunk; });
      response.on("error", reject);
      response.on("end", () => resolve({
        status: response.statusCode,
        headers: response.headers,
        text,
      }));
    }).on("error", reject);
  });
}

for (const [path, heading] of [
  ["/services", "Services"],
  ["/experience", "Experience"],
]) {
  test(`${path} shows its Coming soon page`, async () => {
    const response = await request(path, { headers: navigation });
    assert.equal(response.status, 200);
    const html = response.text;
    assert.match(html, new RegExp(`<h1[^>]*>${heading}</h1>`));
    assert.match(html, /Coming soon/);
    assert.match(html, /<a\b[^>]*\bhref="\/"[^>]*\baria-label="Z3nTry: inicio"[^>]*>\s*<img\b[^>]*\bsrc="\/z3ntry\.webp"/);
    assert.match(html, /<a\b[^>]*\bhref="\/"[^>]*>\s*<svg\b[^>]*\baria-hidden="true"[^>]*>[\s\S]*?<\/svg>\s*<span[^>]*>Volver al inicio<\/span>\s*<\/a>/);
    assert.match(html, /name="robots" content="noindex"/);
  });
}

test("/contact and the landing page expose the shared contact section and footer", async () => {
  for (const path of ["/contact", "/"]) {
    const response = await request(path, { headers: navigation });
    assert.equal(response.status, 200);
    assert.match(response.text, /<section[^>]*\bid="contact"/);
    assert.match(response.text, /<footer[^>]*class="site-footer"/);
    assert.match(response.text, /Powered by <a\b[^>]*\bhref="https:\/\/www\.darwinlatorre\.com\/"[^>]*>Darwinlatorre<\/a>/);
    const contact = response.text.match(/<section[^>]*\bid="contact"[^>]*>[\s\S]*?<\/section>/)?.[0];
    assert.ok(contact);
    assert.match(contact, /<form\b[^>]*action="mailto:contact@z3ntry\.com"/);
    assert.match(contact, /<button\b[^>]*type="submit"[^>]*>Enviar<\/button>/);
    assert.doesNotMatch(contact, /\/api\/contact|instagram\.com|Abre tu aplicación de correo/);
    const footerNav = response.text.match(/<footer\b[^>]*>[\s\S]*?<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(footerNav);
    assert.match(footerNav, /href="https:\/\/www\.instagram\.com\/[^"]+\/"[^>]*>Instagram<\/a>/);
    assert.equal((footerNav.match(/<a\b/g) ?? []).length, 1);
  }
});

test("the decorative ASCII lock sits between Services and Experience", async () => {
  for (const path of ["/", "/about"]) {
    const { text } = await request(path, { headers: navigation });
    assert.match(text, /id="services"[\s\S]+data-ascii-lock[\s\S]+id="experience"/);
  }
});

test("Services and Experience navigation targets real sections on the landing page", async () => {
  const { text } = await request("/", { headers: navigation });
  for (const id of ["services", "experience"]) {
    assert.match(text, new RegExp(`<a\\b[^>]*href="/#${id}"[^>]*data-nav-section="${id}"`));
    assert.match(text, new RegExp(`<section\\b[^>]*id="${id}"`));
  }
});

test("About shows service offerings without requiring a disclosure and links to Contact", async () => {
  for (const [path, contactHref] of [["/", "#contact"], ["/about", "/contact#contact"]]) {
    const response = await request(path, { headers: navigation });
    assert.equal(response.status, 200);
    const about = response.text.split('id="capabilities"')[1]?.split('id="contact"')[0];
    assert.ok(about, path);
    for (const [statement, service] of [["We secure", "Pentesting"], ["We engineer", "APIs and integrations"], ["We position", "Brand identity"]]) {
      assert.ok(about.includes(statement), statement);
      assert.match(about, new RegExp(`<li\\b[^>]*>${service}</li>`));
    }
    assert.doesNotMatch(about, /<details\b/);
    assert.match(about, new RegExp(`<a\\b[^>]*\\bhref="${contactHref}"[^>]*>Talk about your project</a>`));
  }
});

test("a missing page redirects on Vercel and shows the branded 404 locally", async () => {
  const response = await request("/missing-status-test/nested", { headers: navigation });
  if (vercel) {
    assert.equal(response.status, 307);
    assert.equal(new URL(response.headers.location, site).href, new URL("/", site).href);
    assert.match(response.headers["cache-control"], /\bno-store\b/);
  } else {
    assert.equal(response.status, 404);
    assert.match(response.text, /Página no encontrada/);
  }
});

test("missing resources are still 404 responses", async () => {
  for (const [path, headers] of [
    ["/_astro/missing-status-test.css", { Accept: "text/css" }],
    ["/missing-status-test.webp", navigation],
    ["/api/missing-status-test", navigation],
    ["/missing-resource-without-extension", { Accept: "*/*" }],
    ["/reports/fragment", { Accept: "text/html", "Sec-Fetch-Mode": "cors" }],
    ["/bad-html-accept", { ...navigation, Accept: "application/json, text/html;q=0" }],
    ["/quoted-html-accept", { ...navigation, Accept: 'application/json;profile="text/html"' }],
  ]) {
    assert.equal((await request(path, { headers })).status, 404, path);
  }
});

test("the Vercel fallback matches document navigation, not HTML fragment requests", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const [filesystem, redirect] = config.routes;
  assert.equal(filesystem.handle, "filesystem");
  assert.equal(redirect.status, 307);
  assert.equal(redirect.headers.Location, "/");
  const matches = (headers) => redirect.has.every(({ key, value }) => (
    Object.hasOwn(headers, key) && new RegExp(value).test(headers[key])
  ));
  const accept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
  assert.equal(matches({ accept, "sec-fetch-mode": "navigate" }), true);
  assert.equal(matches({ accept, "sec-fetch-mode": "cors" }), false);
  assert.equal(matches({ accept }), false);
  for (const invalid of ["application/json, text/html;q=0", 'application/json;profile="text/html"']) {
    assert.equal(matches({ accept: invalid, "sec-fetch-mode": "navigate" }), false);
  }
});

test("Home, About and existing assets remain reachable", async () => {
  for (const path of ["/", "/about", "/z3ntry.webp"]) {
    assert.equal((await request(path, { headers: navigation })).status, 200, path);
  }
});
