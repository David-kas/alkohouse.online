import { deliveryMoscow } from "./01-delivery";
import { nightMoscow } from "./02-night";
import { nightService } from "./03-night-service";
import { districtsMoscow } from "./04-districts";
import { metroMoscow } from "./05-metro";
import { drinkCategories } from "./06-drinks";
import { moscowRegion } from "./07-region";
import { frequentQuestions } from "./08-questions";
import { extraDrinkBlocks, extraNightBlocks } from "./12-extra-night-drink";
import type { ArticleSection } from "./types";

nightMoscow.blocks.push(...extraNightBlocks);
drinkCategories.blocks.push(...extraDrinkBlocks);

export type { ArticleSection, ArticleBlock, TextPart } from "./types";

export const homeArticleSections: ArticleSection[] = [
  deliveryMoscow,
  nightMoscow,
  nightService,
  districtsMoscow,
  metroMoscow,
  drinkCategories,
  moscowRegion,
  frequentQuestions,
];