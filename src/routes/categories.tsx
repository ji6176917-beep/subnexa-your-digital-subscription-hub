import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { startingPrice, formatUSD } from "@/lib/catalog";
import { useCatalog } from "@/lib/catalog-store";
import { CategoryIconTile } from "@/lib/category-icons";

const title = "All Subscription Categories — SubNexa";
const description =
  "Explore every SubNexa category: AI assistants, photo and video editing, music, education, cloud productivity, developer tools, VPN, marketing and utilities.";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { products, categories } = useCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold">Categories</h1>
        <p className="mt-3 text-muted-foreground">
          {categories.length} curated collections covering every premium subscription we stock.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((c) => {
          const items = products.filter((p) => p.categorySlug === c.slug);
          const cheapest = items
            .map(startingPrice)
            .filter((v): v is number => v != null)
            .sort((a, b) => a - b)[0];
          return (
            <Link
              key={c.slug}
              to="/browse"
              search={{ category: c.slug, q: "" }}
              className="group flex min-h-40 min-w-0 flex-col rounded-xl border border-border/70 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-elevated sm:p-5"
            >
              <div className="flex min-w-0 flex-col items-start gap-3">
                <CategoryIconTile slug={c.slug} />
                <div className="min-w-0">
                  <h2 className="line-clamp-2 text-sm font-semibold sm:text-base">{c.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {c.count} products{cheapest != null && ` · from ${formatUSD(cheapest)}`}
                  </p>
                </div>
              </div>
              <ArrowRight className="mt-auto size-5 self-end text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
