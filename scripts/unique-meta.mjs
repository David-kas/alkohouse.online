/**
 * Unique SEO metadata for secondary domains.
 * Run after a page generator. Re-running is safe.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const isHouse = home.includes('https://alkohouse.online');
const key = isHouse ? 'house' : '24';
const brand = isHouse ? 'AlkoHouse' : 'АЛКОдоставка 24';
const marker = '<!-- unique-meta:' + key + ' -->';
const titles = new Set(), descriptions = new Set();
const clean = v => String(v || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&quot;/gi, '"').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
const escapeHtml = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function clip(str, max) {
  const s = clean(str);
  if (s.length <= max) return s;
  const p = s.slice(0, max + 1), i = p.lastIndexOf(' ');
  return (i > max * 0.6 ? p.slice(0, i) : p.slice(0, max)).replace(/[\s,;:—–-]+$/, '');
}
function filesIn(dir) {
  const found = [];
  for (const item of fs.readdirSync(dir, {withFileTypes: true})) {
    if (item.isDirectory() && !['.git', '.github', 'node_modules', '.vercel'].includes(item.name)) found.push(...filesIn(path.join(dir, item.name)));
    else if (item.isFile() && item.name.endsWith('.html')) found.push(path.join(dir, item.name));
  }
  return found;
}
function editMeta(html, attr, name, value) {
  return html.replace(/<meta\b[^>]*>/gi, tag => {
    const re = new RegExp('\\b' + attr + '\\s*=\\s*["\\x27]' + name + '["\\x27]', 'i');
    if (!re.test(tag) || !/\bcontent\s*=/i.test(tag)) return tag;
    return tag.replace(/(\bcontent\s*=\s*)(["'])(.*?)\2/i, (_match, prefix) => prefix + '"' + escapeHtml(value) + '"');
  });
}
function dataFor(rel, oldTitle, oldDesc, html) {
  const h1 = clean(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  let topic = h1 || clean(oldTitle.split(/\s+\|\s+/)[0]);
  if (rel.startsWith('metro/')) topic = clean(oldTitle.match(/метро\s*[«"]([^»"]+)[»"]/i)?.[1] || h1.replace(/^.*метро\s*/i,''));
  if (rel.startsWith('raion/')) topic = clean(oldTitle.match(/Доставка алкоголя\s+(.+?),\s*Москва/i)?.[1] || h1.replace(/^.*район\s*/i,''));
  if (rel.startsWith('product/')) topic = clean(oldTitle.split(/\s+[—–]\s+(?:купить|заказать)/i)[0]);
  topic = clip(topic, 95);
  const price = oldDesc.match(/(\d[\d\s]{0,7})\s*₽/)?.[1]?.trim();
  let title, desc;
  if (rel === 'index.html') {
    title = isHouse ? 'Алкоголь и напитки в Москве — каталог и заказ | AlkoHouse' : 'Алкоголь и закуски в Москве — выбор и заказ | АЛКОдоставка 24';
    desc = isHouse ? 'AlkoHouse — каталог напитков и закусок для Москвы. Посмотрите категории, цены и условия оформления заказа на сайте. 18+.' : 'АЛКОдоставка 24: ассортимент алкогольных напитков и закусок в Москве. Каталог с ценами, условия доставки, способы связи и заказ онлайн. 18+.';
  } else if (rel.startsWith('metro/')) {
    title = isHouse ? 'Напитки у метро «' + topic + '» — каталог | AlkoHouse' : 'Доставка алкоголя у метро «' + topic + '» | АЛКОдоставка 24';
    desc = isHouse ? 'AlkoHouse: ассортимент напитков и закусок у метро «' + topic + '» в Москве. Варианты заказа и условия доставки по адресу. 18+.' : 'У метро «' + topic + '» в Москве: алкоголь и закуски в каталоге АЛКОдоставка 24. Информация о доставке, заказе и контактах. 18+.';
  } else if (rel.startsWith('raion/')) {
    title = isHouse ? 'Напитки с доставкой в ' + topic + ' | AlkoHouse' : 'Доставка алкоголя в ' + topic + ', Москва | АЛКОдоставка 24';
    desc = isHouse ? 'AlkoHouse: подбор напитков для района ' + topic + ' в Москве. Ассортимент, оформление заказа и условия доставки. 18+.' : 'АЛКОдоставка 24: алкоголь и закуски для района ' + topic + ' в Москве. Посмотрите каталог и условия заказа с доставкой. 18+.';
  } else if (rel.startsWith('product/')) {
    title = topic + (isHouse ? ' — цена и доставка | AlkoHouse' : ' — заказать в Москве | АЛКОдоставка 24');
    desc = isHouse ? 'AlkoHouse: ' + topic + '. ' + (price ? 'Цена ' + price + ' ₽. ' : '') + 'Карточка товара, корзина и сведения об оформлении заказа. 18+.' : 'Товар «' + topic + '» в каталоге АЛКОдоставка 24. ' + (price ? 'Стоимость ' + price + ' ₽. ' : '') + 'Описание и заказ по Москве. 18+.';
  } else if (rel.startsWith('vopros/')) {
    title = topic + (isHouse ? ' — ответы | AlkoHouse' : ' — справка | АЛКОдоставка 24');
    desc = (isHouse ? 'Справка AlkoHouse: ' : 'Разъяснения АЛКОдоставка 24: ') + topic + '. ' + clean(oldDesc);
  } else {
    title = topic + (isHouse ? ' — выбор и условия | AlkoHouse' : ' — ассортимент и заказ | АЛКОдоставка 24');
    desc = (isHouse ? 'На AlkoHouse: ' : 'АЛКОдоставка 24 — ') + topic + '. ' + clean(oldDesc);
  }
  const suffix = ' | ' + brand;
  if (title.length > 78) title = clip(title.endsWith(suffix) ? title.slice(0, -suffix.length) : title, 78 - suffix.length) + suffix;
  if (desc.length > 159) desc = clip(desc, 152) + (desc.includes('18+') ? ' 18+.' : '.');
  if (!desc.endsWith('.')) desc += '.';
  return {title, desc};
}
const pages = filesIn(ROOT).sort();
let changed = 0;
for (const full of pages) {
  const rel = path.relative(ROOT, full).split(path.sep).join('/');
  if (/^(admin\/|pc-blocked\.html$|tmp-|google[a-z0-9]|yandex_)/i.test(rel)) continue;
  let html = fs.readFileSync(full, 'utf8');
  if (html.includes(marker)) continue;
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(/<meta\b(?=[^>]*\bname\s*=\s*["']description["'])[^>]*>/i);
  const oldDesc = descMatch?.[0].match(/\bcontent\s*=\s*(["'])(.*?)\1/i)?.[2];
  if (!titleMatch || oldDesc === undefined) continue;
  const {title: firstTitle, desc: firstDesc} = dataFor(rel, clean(titleMatch[1]), clean(oldDesc), html);
  let title = firstTitle, desc = firstDesc, n = 1;
  while (titles.has(title.toLowerCase())) {
    const label = (rel.split('/').at(-1) === 'index.html' ? rel.split('/').at(-2) : rel.split('/').at(-1).replace(/\.html$/, ''));
    title = clip(firstTitle.replace(/\s+\|\s+[^|]+$/, ''), 45) + ' — ' + label + (n > 1 ? ' ' + n : '') + ' | ' + brand;
    n++;
  }
  if (descriptions.has(desc.toLowerCase())) desc = clip(firstDesc, 120) + ' Раздел: ' + clip(rel, 25) + '.';
  titles.add(title.toLowerCase()); descriptions.add(desc.toLowerCase());
  html = html.replace(titleMatch[0], '<title>' + escapeHtml(title) + '</title>\n  ' + marker);
  for (const [attr, name, val] of [
    ['name', 'description', desc], ['property', 'og:title', title], ['property', 'og:description', desc],
    ['name', 'twitter:title', title], ['name', 'twitter:description', desc]
  ]) html = editMeta(html, attr, name, val);
  fs.writeFileSync(full, html, 'utf8');
  changed++;
}
console.log('Unique SEO metadata for ' + brand + ': updated ' + changed + ' of ' + pages.length + ' HTML files');
