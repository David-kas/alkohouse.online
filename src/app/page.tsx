import { Hero } from "@/components/home/Hero";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { GeoExplorer } from "@/components/home/GeoExplorer";
import { SeoContent } from "@/components/home/SeoContent";
import { getAllProducts } from "@/lib/catalog";
import { itemListJsonLd } from "@/lib/schema";

export const dynamic = "force-static";

export default async function HomePage() {
  const products = await getAllProducts();
  const itemList = itemListJsonLd(products);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <Hero />
      <CatalogClient products={products} />
      <GeoExplorer />
      <SeoContent />
    </>
  );
}