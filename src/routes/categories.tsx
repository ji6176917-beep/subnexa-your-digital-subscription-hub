import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categories, products, startingPrice, formatUSD } from "@/lib/catalog";

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
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold">Categories</h1>
        <p className="mt-3 text-muted-foreground">
          {categories.length} curated collections covering every premium subscription we stock.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
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
              className="group rounded-xl border border-border/70 bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-elevated"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-lg bg-secondary text-2xl">
                  {c.emoji}
                </span>
                <div>
                  <h2 className="text-lg font-semibold">{c.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {c.count} products{cheapest != null && ` · from ${formatUSD(cheapest)}`}
                  </p>
                </div>
                <ArrowRight className="ml-auto size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                {items
                  .slice(0, 8)
                  .map((p) => p.name)
                  .join(" · ")}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
