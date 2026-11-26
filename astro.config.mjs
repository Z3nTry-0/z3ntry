import process from "node:process";

import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://z3ntry.com",
  output: "static"
});
