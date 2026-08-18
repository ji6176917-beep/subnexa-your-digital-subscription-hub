import { createFileRoute } from "@tanstack/react-router";
import { Bot, Globe2, LineChart, Percent, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const title = "Reseller Program — Earn up to 40% with SubNexa";
const description =
  "Join the SubNexa reseller program for wholesale pricing, dedicated stock, an official Telegram bot and commissions up to 40% per order.";

export const Route = createFileRoute("/reseller")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ResellerPage,
});

const perks = [
  { icon: Percent, title: "Up to 40% commission", text: "Tiered rates that scale with monthly volume." },
  { icon: Bot, title: "Official Telegram bot", text: "Place orders and track delivery without leaving chat." },
  { icon: LineChart, title: "Live sales dashboard", text: "Track orders, payouts and customer renewals." },
  { icon: Users, title: "Account manager", text: "A dedicated human for stock, pricing and escalations." },
  { icon: Globe2, title: "Multilingual storefront", text: "Sell to customers in their own language." },
];

function ResellerPage() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold">Reseller program</h1>
        <p className="mt-3 text-muted-foreground">
          Sell 551 premium subscriptions under your own brand with wholesale pricing and automated
          fulfilment.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {perks.map((p) => (
            <div key={p.title} className="rounded-xl border border-border/70 bg-card p-5 shadow-soft">
              <p.icon className="size-5 text-primary" />
              <h2 className="mt-3 font-semibold">{p.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>

        <form
          className="rounded-2xl border border-border/70 bg-card p-6 shadow-elevated"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              toast.success("Application received", {
                description: "Our partnerships team will reply within 24 hours.",
              });
              (e.target as HTMLFormElement).reset();
            }, 600);
          }}
        >
          <h2 className="text-lg font-semibold">Apply to become a reseller</h2>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram username</Label>
              <Input id="telegram" placeholder="@yourhandle" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume">Expected monthly volume</Label>
              <Input id="volume" placeholder="e.g. 50 orders" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">Tell us about your audience</Label>
              <Textarea id="about" rows={4} placeholder="Where and how do you sell today?" />
            </div>
          </div>
          <Button type="submit" className="mt-6 w-full" size="lg" disabled={submitting}>
            {submitting ? "Sending…" : "Submit application"}
          </Button>
        </form>
      </div>
    </div>
  );
}
