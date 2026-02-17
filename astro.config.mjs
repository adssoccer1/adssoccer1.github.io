import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { remarkReadingTime } from "./src/remark-reading-time.mjs";

export default defineConfig({
  site: "https://adssoccer1.github.io",
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
