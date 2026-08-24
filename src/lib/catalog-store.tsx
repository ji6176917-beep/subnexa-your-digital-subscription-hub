import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  billingKeys,
  categories as baseCategories,
  products as baseProducts,
  startingPrice,
  type BillingKey,
  type Category,
  type Product,
} from "@/lib/catalog";

export type EditableProduct = Product & {
  description?: string | null;
  logoUrl?: string | null;
};

type StoreState = {
  custom: EditableProduct[];
  edits: Record<number, Partial<EditableProduct>>;
  deleted: number[];
};

const STORAGE_KEY = "subnexa.catalog.v1";
const empty: StoreState = { custom: [], edits: {}, deleted: [] };

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ProductInput = {
  name: string;
  category: string;
  description?: string;
  logoUrl?: string;
  prices: Record<BillingKey, number | null>;
  customOptions?: string | null;
};

type CatalogContextValue = {
  products: EditableProduct[];
  categories: Category[];
  hydrated: boolean;
  getProduct: (slug: string) => EditableProduct | undefined;
  searchProducts: (query: string, categorySlug?: string) => EditableProduct[];
  relatedProducts: (product: Product, limit?: number) => EditableProduct[];
  addProduct: (input: ProductInput) => EditableProduct;
  updateProduct: (id: number, input: ProductInput) => void;
  deleteProduct: (id: number) => void;
  isCustom: (id: number) => boolean;
  resetOverrides: () => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...empty, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const products = useMemo<EditableProduct[]>(() => {
    const deleted = new Set(state.deleted);
    const merged = (baseProducts as EditableProduct[])
      .filter((p) => !deleted.has(p.id))
      .map((p) => (state.edits[p.id] ? { ...p, ...state.edits[p.id] } : p));
    return [...state.custom.filter((p) => !deleted.has(p.id)), ...merged];
  }, [state]);

  const categories = useMemo<Category[]>(() => {
    const counts = new Map<string, number>();
    for (const p of products) counts.set(p.categorySlug, (counts.get(p.categorySlug) ?? 0) + 1);
    const known = new Map(baseCategories.map((c) => [c.slug, c]));
    const list: Category[] = [];
    for (const c of baseCategories) {
      const count = counts.get(c.slug) ?? 0;
      if (count > 0) list.push({ ...c, count });
    }
    for (const p of products) {
      if (known.has(p.categorySlug) || list.some((c) => c.slug === p.categorySlug)) continue;
      list.push({
        name: p.category,
        slug: p.categorySlug,
        emoji: "✨",
        count: counts.get(p.categorySlug) ?? 0,
      });
    }
    return list;
  }, [products]);

  const nextId = useCallback(() => {
    const max = products.reduce((m, p) => Math.max(m, p.id), 0);
    return max + 1;
  }, [products]);

  const toProduct = useCallback(
    (input: ProductInput, id: number, slug: string): EditableProduct => ({
      id,
      name: input.name.trim(),
      slug,
      category: input.category.trim(),
      categorySlug: slugify(input.category),
      prices: billingKeys.reduce(
        (acc, k) => ({ ...acc, [k]: input.prices[k] ?? null }),
        {} as Record<BillingKey, number | null>,
      ),
      customOptions: input.customOptions?.trim() ? input.customOptions.trim() : null,
      description: input.description?.trim() ? input.description.trim() : null,
      logoUrl: input.logoUrl?.trim() ? input.logoUrl.trim() : null,
    }),
    [],
  );

  const addProduct = useCallback(
    (input: ProductInput) => {
      const id = nextId();
      const base = slugify(input.name) || `product-${id}`;
      const taken = new Set(products.map((p) => p.slug));
      let slug = base;
      let i = 2;
      while (taken.has(slug)) slug = `${base}-${i++}`;
      const product = toProduct(input, id, slug);
      setState((s) => ({ ...s, custom: [product, ...s.custom] }));
      return product;
    },
    [nextId, products, toProduct],
  );

  const updateProduct = useCallback(
    (id: number, input: ProductInput) => {
      const existing = products.find((p) => p.id === id);
      if (!existing) return;
      const updated = toProduct(input, id, existing.slug);
      setState((s) => {
        if (s.custom.some((p) => p.id === id)) {
          return { ...s, custom: s.custom.map((p) => (p.id === id ? updated : p)) };
        }
        const { id: _id, slug: _slug, ...patch } = updated;
        return { ...s, edits: { ...s.edits, [id]: patch } };
      });
    },
    [products, toProduct],
  );

  const deleteProduct = useCallback((id: number) => {
    setState((s) => ({
      ...s,
      custom: s.custom.filter((p) => p.id !== id),
      deleted: s.deleted.includes(id) ? s.deleted : [...s.deleted, id],
    }));
  }, []);

  const value = useMemo<CatalogContextValue>(() => {
    const getProduct = (slug: string) => products.find((p) => p.slug === slug);
    return {
      products,
      categories,
      hydrated,
      getProduct,
      searchProducts: (query: string, categorySlug?: string) => {
        const q = query.trim().toLowerCase();
        return products.filter((p) => {
          if (categorySlug && categorySlug !== "all" && p.categorySlug !== categorySlug) return false;
          if (!q) return true;
          return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        });
      },
      relatedProducts: (product: Product, limit = 4) =>
        products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, limit),
      addProduct,
      updateProduct,
      deleteProduct,
      isCustom: (id: number) => state.custom.some((p) => p.id === id),
      resetOverrides: () => setState(empty),
    };
  }, [products, categories, hydrated, addProduct, updateProduct, deleteProduct, state.custom]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}

export { startingPrice };
