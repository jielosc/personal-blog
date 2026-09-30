import { defineConfig } from "astro/config";

// GitHub Actions supplies these automatically; local builds use the root path.
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  markdown: { shikiConfig: { theme: "github-light" } },
});
