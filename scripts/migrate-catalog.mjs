import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import slugify from "slugify";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SEED = path.join(ROOT, "data", "catalog.seed.json");
const OUT = path.join(ROOT, "data", "catalog.json");

function detectCategory(name, legacy) {
  const n = name.toLowerCase();
  if (n.includes("водк") || n.includes("настойк")) return "vodka";
  if (n.includes("виски")) return "whisky";
  if (n.includes("коньяк")) return "cognac";
  if (n.includes("шампан") || n.includes("игрист") || n.includes("prosecco") || n.includes("asti"))
    return "sparkling";
  if (n.includes("вино") || n.includes("вилла франческа") || n.includes("вермут")) return "wine";
  if (n.includes("пив") && !n.includes("пивот")) return "beer";
  if (/\bром\b/.test(n) || (n.includes("ром ") && !n.includes("пр"))) return "rum";
  if (n.includes("джин")) return "gin";
  if (n.includes("текил")) return "tequila";
  if (n.includes("лик") || n.includes("aperol") || n.includes("baileys") || n.includes("jäger") || n.includes("jager"))
    return "liqueur";
  if (n.includes("сигар")) return "cigarettes";
  if (n.includes("сидр")) return "cider";
  if (legacy === "snacks" || n.includes("вялен") || n.includes("сухар") || n.includes("чипс") || n.includes("орех") || n.includes("арахис") || n.includes("кешью") || n.includes("оливк"))
    return "snacks";
  if (legacy === "beer") return "beer";
  if (legacy === "wine") return "wine";
  return "other";
}

function extractVolume(name) {
  const m = name.match(/(\d+[.,]?\d*)\s*(л|литр|г|мл|%)/i);
  return m ? m[0].replace(",", ".") : "";
}

function extractBrand(name) {
  const quoted = name.match(/«([^»]+)»/);
  if (quoted) return quoted[1];
  const latin = name.match(/\b([A-Z][A-Za-z0-9'.\-]+(?:\s+[A-Z][A-Za-z0-9'.\-]+)*)\b/);
  if (latin) return latin[1];
  return "";
}

function normalizeImage(image) {
  if (!image) return "/images/placeholder-strong.svg";
  let p = decodeURIComponent(image).replace(/^\.?\//, "");
  if (!p.startsWith("images/")) p = `images/${p}`;
  const file = path.basename(p);
  const pub = path.join(ROOT, "public", "images", file);
  if (fs.existsSync(pub)) return `/images/${encodeURI(file)}`;
  const dir = path.join(ROOT, "public", "images");
  if (fs.existsSync(dir)) {
    const found = fs.readdirSync(dir).find((f) => f.toLowerCase() === file.toLowerCase());
    if (found) return `/images/${encodeURI(found)}`;
  }
  const placeholders = {
    vodka: "placeholder-strong.svg",
    whisky: "placeholder-strong.svg",
    cognac: "placeholder-strong.svg",
    wine: "placeholder-wine.svg",
    sparkling: "placeholder-wine.svg",
    beer: "placeholder-beer.svg",
    snacks: "placeholder-snack.svg",
  };
  return `/images/${placeholders[category] || placeholders.vodka}`;
}

function buildDescription(product) {
  const { name, category, volume, brand } = product;
  const vol = volume ? ` Формат — ${volume}.` : "";
  const brandLine = brand ? ` В линейке бренда ${brand} этот вариант удобно сравнить с соседними позициями по объёму и цене.` : "";
  const intros = {
    vodka: `Чистый профиль и предсказуемое качество — то, за что выбирают классическую водку для домашнего застолья или компактного запаса.`,
    whisky: `Виски с выраженным характером: можно пить со льдом, в коктейле или подать к десерту, если хочется акцентировать вечер.`,
    cognac: `Коньяк с мягким ароматом дубовой выдержки подойдёт к тихому разговору, подарку или неспешному дегустационному формату.`,
    wine: `Вино для повседневного стола или особого случая — смотрите на стиль (сухое, полусладкое) и сочетайте с закусками из раздела каталога.`,
    sparkling: `Игристое напиток создаёт праздничное настроение: подайте охлаждённым, не перемешивая с сильными ароматами еды.`,
    beer: `Пиво для отдыха дома или компании: лагер, пшеничное или крепкое — в каталоге отмечены объём и стиль.`,
    rum: `Ром универсален в коктейлях и как самостоятельный напиток со льдом; выбирайте светлый или выдержанный профиль под сценарий.`,
    gin: `Джин с ботаническими нотами — основа для тоника и классических коктейлей; храните в прохладе после вскрытия.`,
    tequila: `Текила для коктейля или чистого формата с солью и лаймом; silver и gold отличаются выдержкой и мягкостью.`,
    liqueur: `Ликёр — десертный или дижестивный акцент; добавляйте в кофе, подавайте со льдом или используйте в смешанных напитках.`,
    snacks: `Закуска к напиткам: снеки и рыба удобно дополняют каталог и помогают собрать заказ в одной заявке.`,
    cider: `Сидр — лёгкая яблочная альтернатива пиву, особенно уместна летом и в неформальной компании.`,
    cigarettes: `Табачная продукция представлена в каталоге для сопутствующего заказа; уточняйте наличие по телефону.`,
    other: `Позиция из ассортимента AlkoHouse — уточняйте детали по телефону, если нужна помощь с выбором.`,
  };
  const base = intros[category] || intros.other;
  return `${name}.${vol} ${base}${brandLine} Цена в каталоге указана за текущий формат; оформление заявки доступно через корзину или звонок на +7 (925) 121-99-72.`;
}

const seed = JSON.parse(fs.readFileSync(SEED, "utf8"));
const products = seed.products.map((p) => {
  const category = detectCategory(p.name, p.category);
  const volume = extractVolume(p.name);
  const brand = extractBrand(p.name);
  const slug = slugify(p.id || p.name, { lower: true, strict: true, locale: "ru" });
  const image = normalizeImage(p.image);
  const partial = { name: p.name, category, volume, brand };
  return {
    id: p.id,
    slug,
    name: p.name,
    category,
    legacyCategory: p.category,
    price: p.price,
    image,
    images: [image],
    alt: p.alt || p.name,
  description: buildDescription({ ...partial, name: p.name }),
  shortDesc: p.desc && p.desc.length > 20 ? p.desc : buildDescription(partial).slice(0, 180) + "…",
    characteristics: {
      ...(volume ? { volume } : {}),
      ...(brand ? { brand } : {}),
      category,
      availability: p.inStock ? "В наличии" : "Нет в наличии",
    },
    brand: brand || undefined,
    volume: volume || undefined,
    inStock: Boolean(p.inStock),
    seoTitle: "",
    seoDescription: "",
    sortOrder: 0,
  };
});

products.sort((a, b) => a.name.localeCompare(b.name, "ru"));
products.forEach((p, i) => {
  p.sortOrder = i;
  if (!p.seoTitle) {
    p.seoTitle = `${p.name} — цена и заказ | AlkoHouse`;
  }
  if (!p.seoDescription) {
    p.seoDescription = `${p.name}: ${p.price} ₽. Каталог алкоголя в Москве, заявка через сайт или телефон +7 (925) 121-99-72.`;
  }
});

const catalog = {
  version: 4,
  updatedAt: new Date().toISOString(),
  products,
};

fs.writeFileSync(OUT, JSON.stringify(catalog, null, 2), "utf8");
console.log(`Migrated ${products.length} products → ${OUT}`);