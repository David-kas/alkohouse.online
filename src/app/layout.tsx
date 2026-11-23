import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { MobileBottomBar } from "@/components/ui/MobileBottomBar";
import { PHONE, SITE_NAME, SITE_URL } from "@/lib/constants";
import { organizationJsonLd, websiteJsonLd } from "@/lib/schema";

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Доставка алкоголя в Москве — каталог напитков | AlkoHouse",
    template: "%s | AlkoHouse",
  },
  description: `AlkoHouse — каталог алкогольных напитков в Москве: водка, виски, вино, коньяк, пиво и шампанское. Цены, характеристики и информация по телефону ${PHONE}.`,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Доставка алкоголя в Москве — каталог напитков | AlkoHouse",
    description: `Каталог алкогольных напитков в Москве. Телефон ${PHONE}.`,
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: `Каталог алкоголя в Москве. ${PHONE}` },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121418",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [organizationJsonLd(), websiteJsonLd()];
  return (
    <html lang="ru">
      <body className={`${sans.variable} ${display.variable} min-h-screen bg-graphite font-sans text-cream antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <CartProvider>
          <Header />
          <main className="pb-20 md:pb-0">{children}</main>
          <Footer />
          <CartDrawer />
          <MobileBottomBar />
          <ScrollToTop />
        </CartProvider>
      </body>
    </html>
  );
}