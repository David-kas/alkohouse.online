export type TextPart = string | { type: "link"; href: string; label: string };

export type ArticleBlock =
  | { type: "p"; parts: TextPart[] }
  | { type: "h3"; text: string };

export type ArticleSection = {
  id: string;
  h2: string;
  blocks: ArticleBlock[];
  /** Второстепенный текст — в `<details>` без JS */
  details?: { title: string; blocks: ArticleBlock[] };
};