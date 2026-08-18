import catalog from "@/data/catalog.json";

export type BillingKey = "m1" | "m3" | "m12" | "m18" | "m36";

export type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  prices: Record<BillingKey, number | null>;
  customOptions: string | null;
};

export type Category = {
  name: string;
  slug: string;
  emoji: string;
  count: number;
};

export const products = catalog.products as Product[];
export const categories = catalog.categories as Category[];

export const billingLabels: Record<BillingKey, string> = {
  m1: "1 Month",
  m3: "3 Months",
  m12: "12 Months",
  m18: "18 Months",
  m36: "36 Months",
};

export const billingKeys: BillingKey[] = ["m1", "m3", "m12", "m18", "m36"];

export function availablePlans(product: Product) {
  return billingKeys
    .filter((k) => product.prices[k] != null)
    .map((k) => ({ key: k, label: billingLabels[k], price: product.prices[k] as number }));
}

export function startingPrice(product: Product) {
  const values = billingKeys
    .map((k) => product.prices[k])
    .filter((v): v is number => v != null);
  return values.length ? Math.min(...values) : null;
}

export function formatUSD(value: number) {
  return `$${value.toFixed(2)}`;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function relatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export function searchProducts(query: string, categorySlug?: string) {
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    if (categorySlug && categorySlug !== "all" && p.categorySlug !== categorySlug) return false;
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });
}

export const totalProducts = products.length;
