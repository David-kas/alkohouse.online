import Link from "next/link";
import type { ArticleBlock, TextPart } from "@/content/home-article/types";

function renderParts(parts: TextPart[]) {
  return parts.map((part, i) => {
    if (typeof part === "string") return <span key={i}>{part}</span>;
    return (
      <Link key={i} href={part.href} className="text-gold underline underline-offset-2 hover:text-cream">
        {part.label}
      </Link>
    );
  });
}

export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "h3") {
          return (
            <h3 key={i} className="mt-8 font-display text-xl text-cream">
              {block.text}
            </h3>
          );
        }
        return (
          <p key={i} className="mt-4 text-cream/80 leading-relaxed">
            {renderParts(block.parts)}
          </p>
        );
      })}
    </>
  );
}