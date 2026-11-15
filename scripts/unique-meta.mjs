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
  if (rel.startsWith('product/')) topic = clean(h1 || oldTitle.split(/\s+[—–]\s+(?:купить|заказать|цена)/i)[0]);
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
    title = topic + (isHouse ? ' — FAQ | AlkoHouse' : ' — ответы | АЛКОдоставка 24');
    desc = (isHouse ? 'Ответы AlkoHouse на вопрос «' : 'Справка АЛКОдоставка 24: «') + topic + '». Условия заказа и важные подробности представлены на странице. 18+.';
  } else if (/^(faq\.html|faq\/)/.test(rel)) {
    title = 'Вопросы о заказе алкоголя в Москве' + (isHouse ? ' | AlkoHouse' : ' | АЛКОдоставка 24');
    desc = isHouse ? 'FAQ AlkoHouse: сроки и стоимость доставки напитков по Москве, оплата, оформление заказа и связь с оператором. Ответы на частые вопросы. 18+.' : 'Вопросы и ответы от АЛКОдоставка 24: оформление заказов, стоимость, сроки доставки, оплата и контакты для Москвы. 18+.';
  } else if (/^(about|contacts|blog|privacy|policy|catalog)/.test(rel)) {
    const kind = rel.startsWith('blog') ? 'Статьи и рекомендации о напитках' : rel.startsWith('about') ? 'Информация о сервисе' : rel.startsWith('contacts') ? 'Контакты и оформление заказа' : /privacy|policy/.test(rel) ? 'Информация о правилах сайта' : 'Раздел каталога напитков';
    title = topic + (isHouse ? ' | AlkoHouse' : ' | АЛКОдоставка 24');
    desc = (isHouse ? 'AlkoHouse: ' : 'АЛКОдоставка 24: ') + kind + '. ' + (rel.startsWith('blog') ? 'Полезные материалы о выборе, характеристиках и сочетании напитков.' : rel.startsWith('contacts') ? 'Способы связи и информация для оформления заказа в Москве.' : rel.startsWith('about') ? 'Порядок работы, подбор товаров и условия заказа в Москве.' : /privacy|policy/.test(rel) ? 'Условия и положения, опубликованные на сайте.' : 'Ассортимент, категории товаров, цены и информация о заказе в Москве.') + ' 18+.';
  } else {
    title = topic + (isHouse ? ' — выбор и условия | AlkoHouse' : ' — ассортимент и заказ | АЛКОдоставка 24');
    desc = (isHouse ? 'AlkoHouse: ' : 'АЛКОдоставка 24: ') + 'раздел «' + topic + '». Выбор напитков и закусок, сведения о товарах и оформлении заказа в Москве. 18+.';
  }
  const suffix = ' | ' + brand;
  if (title.length > 78) {
    const tail = /^(faq|vopros)/.test(rel) ? ' — ответы' : rel.startsWith('product/') ? ' — цена' : ' — заказ';
    title = clip(topic, 78 - suffix.length - tail.length) + tail + suffix;
  }
  const has18 = /18\+/.test(desc);
  let coreDesc = desc.replace(/\s*18\+\.\s*$/, '').trim();
  const maxCore = has18 ? 151 : 158;
  if (coreDesc.length > maxCore) {
    const sentences = coreDesc.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    let chosen = '';
    for (const sentence of sentences) {
      const candidate = (chosen + ' ' + sentence.trim()).trim();
      if (candidate.length <= maxCore) chosen = candidate;
      else break;
    }
    coreDesc = chosen || clip(coreDesc, maxCore - 1) + '.';
  }
  coreDesc = coreDesc.replace(/[.\s]+$/, '') + '.';
  desc = coreDesc + (has18 ? ' 18+.' : '');
  return {title, desc};
}
const pages = filesIn(ROOT).sort();
let changed = 0;
for (const full of pages) {
  const rel = path.relative(ROOT, full).split(path.sep).join('/');
  if (/^(admin\/|pc-blocked\.html$|tmp-|google[a-z0-9]|yandex_)/i.test(rel)) continue;
  let html = fs.readFileSync(full, 'utf8');
  html = html.replace(marker, '');
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
