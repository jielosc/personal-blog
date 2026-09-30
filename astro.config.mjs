import { defineConfig } from "astro/config";

// GitHub Actions supplies these automatically; local builds use the root path.
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  // Keep this small blog's CSS in each HTML page so styling does not depend
  // on a separate asset request after a domain change or stale edge cache.
  build: { inlineStylesheets: "always" },
  markdown: { shikiConfig: { theme: "github-light" } },
});
