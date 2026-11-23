import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getSimilarProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/schema";
import { ProductActions } from "@/components/product/ProductActions";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDesc,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const similar = await getSimilarProducts(product);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Главная", url: SITE_URL },
    { name: CATEGORY_LABELS[product.category], url: `${SITE_URL}/#catalog` },
    { name: product.name, url: `${SITE_URL}/product/${product.slug}` },
  ]);

  return (
    <article className="mx-auto max-w-7xl px-4 pb-16 pt-28 lg:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <nav className="mb-6 text-sm text-cream/60" aria-label="Хлебные крошки">
        <Link href="/" className="hover:text-gold">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <Link href="/#catalog" className="hover:text-gold">
          {CATEGORY_LABELS[product.category]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream">{product.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-black/30">
          <Image src={product.image} alt={product.alt} fill priority className="object-contain p-8" sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-gold">{CATEGORY_LABELS[product.category]}</p>
          <h1 className="mt-2 font-display text-3xl text-cream md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold text-gold">{formatPrice(product.price)}</p>
          <p className="mt-2 text-sm text-cream/70">
            {product.inStock ? "В наличии" : "Нет в наличии"}
          </p>
          <ProductActions product={product} />
          <h2 className="mt-10 font-display text-xl text-gold">Описание</h2>
          <p className="mt-3 text-cream/80">{product.description}</p>
          <h2 className="mt-8 font-display text-xl text-gold">Характеристики</h2>
          <dl className="mt-3 grid gap-2 text-sm">
            {Object.entries(product.characteristics).map(([k, v]) =>
              v ? (
                <div key={k} className="flex gap-2 border-b border-white/5 pb-2">
                  <dt className="text-cream/50">{k}</dt>
                  <dd className="text-cream">{v}</dd>
                </div>
              ) : null,
            )}
          </dl>
        </div>
      </div>
      {similar.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-cream">Похожие товары</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {similar.map((p) => (
              <li key={p.id} className="rounded-xl border border-white/10 p-3">
                <Link href={`/product/${p.slug}`} className="text-sm text-cream hover:text-gold">
                  {p.name}
                </Link>
                <p className="mt-1 text-xs text-cream/60">{formatPrice(p.price)}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}