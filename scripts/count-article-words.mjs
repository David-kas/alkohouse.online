import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "content", "home-article");
let text = "";
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".ts") || f === "types.ts" || f === "index.ts") continue;
  text += fs.readFileSync(path.join(dir, f), "utf8");
}
const strings = [...text.matchAll(/"([^"\\]|\\.)*"/g)].map((m) => m[0].slice(1, -1));
const words = strings.join(" ").split(/\s+/).filter(Boolean).length;
console.log("Estimated Russian word count:", words);