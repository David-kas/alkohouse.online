export type ProductCategory =
  | "vodka"
  | "whisky"
  | "cognac"
  | "wine"
  | "sparkling"
  | "beer"
  | "rum"
  | "gin"
  | "tequila"
  | "liqueur"
  | "snacks"
  | "cider"
  | "cigarettes"
  | "other";

export interface ProductCharacteristics {
  volume?: string;
  brand?: string;
  category?: string;
  availability?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  legacyCategory?: string;
  price: number;
  image: string;
  images: string[];
  alt: string;
  description: string;
  shortDesc: string;
  characteristics: ProductCharacteristics;
  brand?: string;
  volume?: string;
  inStock: boolean;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
}

export interface CatalogData {
  version: number;
  updatedAt: string;
  products: Product[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderPayload {
  name: string;
  phone: string;
  address: string;
  comment?: string;
  items: CartItem[];
  total: number;
  source: string;
}