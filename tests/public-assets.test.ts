import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { afterEach, test } from "node:test";
import { resolvePublicAssetPath, GITHUB_PAGES_BASE_PATH } from "../lib/public-assets.ts";

const require = createRequire(import.meta.url);
const { getImageProps } = require("next/image");
const originalFlag = process.env.GITHUB_PAGES;

afterEach(() => {
  if (originalFlag === undefined) delete process.env.GITHUB_PAGES;
  else process.env.GITHUB_PAGES = originalFlag;
});

// Include every calculator asset: products, colors, placements, previews,
// packaging, and front/back views from the multi-placement configuration.
const calculatorPaths = [
  "../components/calculator/calculator.tsx",
  "../config/multi-embroidery.ts",
].flatMap((file) => [...readFileSync(new URL(file, import.meta.url), "utf8")
  .matchAll(/resolvePublicAssetPath\("([^"]+)"\)/g)].map((match) => match[1]));

for (const githubPages of [false, true]) {
  test(`calculator images work in ${githubPages ? "GitHub Pages" : "normal"} builds and in the browser`, async () => {
    if (githubPages) process.env.GITHUB_PAGES = "true";
    else delete process.env.GITHUB_PAGES;

    const { default: config } = await import(`../next.config.ts?pages=${githubPages}`);
    const expectedPrefix = githubPages ? GITHUB_PAGES_BASE_PATH : "";
    assert.equal(config.basePath ?? "", expectedPrefix);
    // Without this build-time substitution, the browser has no deployment flag.
    assert.equal(config.env.GITHUB_PAGES, String(githubPages));
    const serverPaths = calculatorPaths.map(resolvePublicAssetPath);
    delete process.env.GITHUB_PAGES;
    Object.assign(process.env, config.env);
    assert.deepEqual(calculatorPaths.map(resolvePublicAssetPath), serverPaths);

    assert.ok(calculatorPaths.length >= 50, "calculator asset inventory must not be empty or partial");
    for (const [index, path] of calculatorPaths.entries()) {
      assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), `Missing asset: ${path}`);
      const src = serverPaths[index];
      assert.equal(src, `${expectedPrefix}${path}`);
      assert.equal(resolvePublicAssetPath(src), src, `Repeated resolution: ${path}`);
      const { props } = getImageProps({
        src, alt: "", width: 400, height: 400,
        unoptimized: config.images.unoptimized,
      });
      assert.equal(props.src, src, `next/image changed the prefix: ${path}`);
      assert.equal(props.srcSet, undefined);
    }
  });
}
