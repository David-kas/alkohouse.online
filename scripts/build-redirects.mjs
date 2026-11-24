import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import slugify from "slugify";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "catalog.json"), "utf8"));
const legacyProductDir = path.join(ROOT, "_legacy_backup", "product");
const out = path.join(ROOT, "data", "legacy-redirects.json");

const byName = new Map();
for (const p of catalog.products) {
  byName.set(p.name.toLowerCase(), `/product/${p.slug}`);
}

const redirects = {
  "/catalog.html": "/",
  "/index.html": "/",
  "/privacy.html": "/privacy",
  "/policy.html": "/privacy",
  "/vodka.html": "/#catalog-vodka",
  "/vino/index.html": "/#catalog-wine",
};

if (fs.existsSync(legacyProductDir)) {
  for (const file of fs.readdirSync(legacyProductDir)) {
    if (!file.endsWith(".html")) continue;
    const legacy = `/product/${file}`;
    const titleMatch = fs
      .readFileSync(path.join(legacyProductDir, file), "utf8")
      .match(/<h1[^>]*>([^<]+)</i);
    const h1 = titleMatch?.[1]?.trim();
    let dest = "/";
    if (h1) {
      const key = h1.replace(/\s+/g, " ").toLowerCase();
      dest = byName.get(key) || dest;
    }
    redirects[legacy] = dest;
  }
}

fs.writeFileSync(out, JSON.stringify(redirects, null, 2), "utf8");
console.log(`Redirects: ${Object.keys(redirects).length}`);