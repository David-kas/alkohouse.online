import type { ProductCategory } from "./types";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  vodka: "Водка",
  whisky: "Виски",
  cognac: "Коньяк",
  wine: "Вино и вермут",
  sparkling: "Шампанское и игристое",
  beer: "Пиво",
  rum: "Ром",
  gin: "Джин",
  tequila: "Текила",
  liqueur: "Ликёры",
  snacks: "Закуски",
  cider: "Сидр",
  cigarettes: "Сигареты",
  other: "Прочее",
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "vodka",
  "whisky",
  "cognac",
  "wine",
  "sparkling",
  "beer",
  "rum",
  "gin",
  "tequila",
  "liqueur",
  "snacks",
  "cider",
  "cigarettes",
  "other",
];