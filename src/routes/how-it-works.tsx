import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, PackageCheck, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const title = "How SubNexa Works — Buy Premium Subscriptions";
const description =
  "Four simple steps: browse the catalog, pick a plan term, pay securely, and receive your premium subscription instantly with warranty support.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    icon: Search,
    title: "1. Find your subscription",
    text: "Search 551 products or filter by category to find the exact tool you need.",
  },
  {
    icon: CreditCard,
    title: "2. Choose a term and pay",
    text: "Pick 1, 3, 12, 18 or 36 months. Longer terms carry the lowest monthly cost.",
  },
  {
    icon: PackageCheck,
    title: "3. Receive access instantly",
    text: "Delivery details land in your dashboard and on Telegram within minutes.",
  },
  {
    icon: ShieldCheck,
    title: "4. Stay covered",
    text: "Every order carries a full-term warranty with free replacement if access lapses.",
  },
];

function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold">How SubNexa works</h1>
        <p className="mt-3 text-muted-foreground">
          From browsing to activation, most orders complete in under five minutes.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {steps.map((s) => (
          <div key={s.title} className="rounded-xl border border-border/70 bg-card p-6 shadow-soft">
            <s.icon className="size-5 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>

      <section className="mt-14 rounded-2xl border border-border/70 bg-surface/50 p-8">
        <h2 className="text-2xl font-bold">Delivery, warranty and refunds</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3 text-sm text-muted-foreground">
          <div>
            <h3 className="text-base font-semibold text-foreground">Delivery time</h3>
            <p className="mt-2">
              Standard orders are delivered within 5–30 minutes. Custom or upgrade orders may take
              up to 24 hours and are confirmed by an agent first.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Warranty</h3>
            <p className="mt-2">
              If access stops working during the purchased term, we replace it free of charge after
              a quick verification.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Refunds</h3>
            <p className="mt-2">
              If we cannot deliver or replace an order, you receive a full refund to your original
              payment method.
            </p>
          </div>
        </div>
        <Button asChild className="mt-8">
          <Link to="/browse">Start browsing</Link>
        </Button>
      </section>
    </div>
  );
}
