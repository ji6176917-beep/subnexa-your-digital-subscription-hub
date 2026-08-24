import { useMemo, useRef, useState } from "react";
import { Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { billingKeys, billingLabels, formatUSD, startingPrice, type BillingKey } from "@/lib/catalog";
import { useCatalog, type EditableProduct, type ProductInput } from "@/lib/catalog-store";

type FormState = {
  name: string;
  category: string;
  description: string;
  logoUrl: string;
  customOptions: string;
  prices: Record<BillingKey, string>;
};

const emptyForm: FormState = {
  name: "",
  category: "",
  description: "",
  logoUrl: "",
  customOptions: "",
  prices: { m1: "", m3: "", m12: "", m18: "", m36: "" },
};

function toForm(p: EditableProduct): FormState {
  return {
    name: p.name,
    category: p.category,
    description: p.description ?? "",
    logoUrl: p.logoUrl ?? "",
    customOptions: p.customOptions ?? "",
    prices: billingKeys.reduce(
      (acc, k) => ({ ...acc, [k]: p.prices[k] != null ? String(p.prices[k]) : "" }),
      {} as Record<BillingKey, string>,
    ),
  };
}

export function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useCatalog();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EditableProduct | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [visible, setVisible] = useState(20);
  const fileRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [products, query]);

  const valid =
    form.name.trim().length >= 2 &&
    form.category.trim().length >= 2 &&
    billingKeys.some((k) => form.prices[k].trim() !== "" && Number(form.prices[k]) > 0);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (p: EditableProduct) => {
    setEditing(p);
    setForm(toForm(p));
    setOpen(true);
  };

  const submit = () => {
    const input: ProductInput = {
      name: form.name,
      category: form.category,
      description: form.description,
      logoUrl: form.logoUrl,
      customOptions: form.customOptions,
      prices: billingKeys.reduce(
        (acc, k) => {
          const raw = form.prices[k].trim();
          const num = Number(raw);
          return { ...acc, [k]: raw !== "" && Number.isFinite(num) && num > 0 ? num : null };
        },
        {} as Record<BillingKey, number | null>,
      ),
    };
    if (editing) {
      updateProduct(editing.id, input);
      toast.success("Product updated", { description: `${input.name} is live on the marketplace.` });
    } else {
      addProduct(input);
      toast.success("Product added", { description: `${input.name} is live on the marketplace.` });
    }
    setOpen(false);
  };

  const onFile = async (file: File) => {
    if (file.size > 400_000) {
      toast.error("Image too large", { description: "Please use an image under 400 KB or a URL." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logoUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Product management</h2>
          <p className="text-sm text-muted-foreground">
            {products.length} products live across {categories.length} categories.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="size-4" /> Add product
        </Button>
      </div>

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(20);
          }}
          placeholder="Search products to edit…"
          className="pl-9"
          aria-label="Search products"
        />
      </div>

      <div className="mt-5 divide-y divide-border/60 rounded-xl border border-border/70 bg-card">
        {results.slice(0, visible).map((p) => {
          const from = startingPrice(p);
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <BrandLogo name={p.name} slug={p.slug} logoUrl={p.logoUrl} size={22} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.category}</p>
              </div>
              <Badge variant="secondary" className="text-[11px]">
                {from != null ? `from ${formatUSD(from)}` : "Custom"}
              </Badge>
              <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                <Pencil className="size-3.5" /> Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  deleteProduct(p.id);
                  toast.success("Product deleted", { description: `${p.name} removed from the marketplace.` });
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          );
        })}
        {results.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">No products match.</p>
        )}
      </div>

      {visible < results.length && (
        <div className="mt-5 text-center">
          <Button variant="outline" onClick={() => setVisible((v) => v + 20)}>
            Load more ({results.length - visible} left)
          </Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "Add new product"}</DialogTitle>
            <DialogDescription>
              Changes sync instantly to the marketplace cards, category pages and search results.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-name">Title</Label>
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="ChatGPT Plus"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="p-category">Category</Label>
                <Input
                  id="p-category"
                  list="admin-categories"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="AI Chat & AI Assistant"
                  className="mt-2"
                />
                <datalist id="admin-categories">
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What the buyer gets, delivery notes, warranty…"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Pricing plans (USD) — leave blank to hide a plan</Label>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {billingKeys.map((k) => (
                  <div key={k}>
                    <Label htmlFor={`price-${k}`} className="text-xs text-muted-foreground">
                      {billingLabels[k]}
                    </Label>
                    <Input
                      id={`price-${k}`}
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.prices[k]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, prices: { ...f.prices, [k]: e.target.value } }))
                      }
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="p-logo">Image / logo URL</Label>
              <div className="mt-2 flex items-center gap-3">
                <BrandLogo name={form.name || "New"} slug="" logoUrl={form.logoUrl} size={26} />
                <Input
                  id="p-logo"
                  value={form.logoUrl.startsWith("data:") ? "" : form.logoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                  placeholder="https://cdn.simpleicons.org/openai"
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onFile(file);
                  }}
                />
                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                  <Upload className="size-4" /> Upload
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="p-options">Custom options (separate with |)</Label>
              <Input
                id="p-options"
                value={form.customOptions}
                onChange={(e) => setForm((f) => ({ ...f, customOptions: e.target.value }))}
                placeholder="Private account | Shared account"
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!valid} onClick={submit}>
              {editing ? "Save changes" : "Add product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
