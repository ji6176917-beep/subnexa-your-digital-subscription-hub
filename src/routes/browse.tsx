import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { startingPrice } from "@/lib/catalog";
import { useCatalog } from "@/lib/catalog-store";

const title = "Browse Premium Subscriptions — SubNexa";
const description =
  "Search and filter 551 premium subscriptions across AI, design, music, education, VPN, developer and productivity categories.";

const searchSchema = z.object({
  q: z.string().catch(""),
  category: z.string().catch("all"),
});

export const Route = createFileRoute("/browse")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: BrowsePage,
});

const sorts = [
  { key: "popular", label: "Featured" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "Name A–Z" },
] as const;

function BrowsePage() {
  const { q, category } = Route.useSearch();
  const navigate = useNavigate({ from: "/browse" });
  const [sort, setSort] = useState<(typeof sorts)[number]["key"]>("popular");
  const [visible, setVisible] = useState(24);
  const { products, categories, searchProducts } = useCatalog();
  const totalProducts = products.length;

  const results = useMemo(() => {
    const list = [...searchProducts(q, category)];
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-asc")
      list.sort((a, b) => (startingPrice(a) ?? 9e9) - (startingPrice(b) ?? 9e9));
    if (sort === "price-desc")
      list.sort((a, b) => (startingPrice(b) ?? -1) - (startingPrice(a) ?? -1));
    return list;
  }, [q, category, sort, searchProducts]);

  function setSearch(next: Partial<{ q: string; category: string }>) {
    setVisible(24);
    navigate({ search: (prev) => ({ ...prev, ...next }) });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold">Browse the marketplace</h1>
        <p className="mt-3 text-muted-foreground">
          {totalProducts} verified premium subscriptions across {categories.length} categories.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setSearch({ q: e.target.value })}
            placeholder="Search ChatGPT, Canva, Netflix, VPN…"
            className="h-12 pl-9"
            aria-label="Search subscriptions"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
          {sorts.map((s) => (
            <Button
              key={s.key}
              size="sm"
              variant={sort === s.key ? "default" : "outline"}
              onClick={() => setSort(s.key)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={category === "all" ? "secondary" : "ghost"}
          onClick={() => setSearch({ category: "all" })}
        >
          All ({totalProducts})
        </Button>
        {categories.map((c) => (
          <Button
            key={c.slug}
            size="sm"
            variant={category === c.slug ? "secondary" : "ghost"}
            onClick={() => setSearch({ category: c.slug })}
          >
            <span className="mr-1">{c.emoji}</span>
            {c.name} ({c.count})
          </Button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min(visible, results.length)} of {results.length} results
        </p>
        {q && <Badge variant="secondary">Query: {q}</Badge>}
      </div>

      {results.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-border py-20 text-center">
          <p className="font-semibold">No subscriptions match that search.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different keyword or reset the filters.
          </p>
          <Button className="mt-6" onClick={() => setSearch({ q: "", category: "all" })}>
            Reset filters
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.slice(0, visible).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {visible < results.length && (
            <div className="mt-10 text-center">
              <Button size="lg" variant="outline" onClick={() => setVisible((v) => v + 24)}>
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
