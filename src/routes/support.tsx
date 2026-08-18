import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const title = "Support & FAQ — SubNexa";
const description =
  "Get help with orders, delivery, warranty and payments. Reach SubNexa support on Telegram, email or the contact form, 24 hours a day.";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SupportPage,
});

const faqs = [
  {
    q: "How fast is delivery?",
    a: "Most orders are delivered within 5–30 minutes. Custom options and upgrades can take up to 24 hours because an agent confirms them manually.",
  },
  {
    q: "Are the subscriptions genuine?",
    a: "Yes. Every subscription is sourced and verified before dispatch, and each order carries a warranty for the full purchased term.",
  },
  {
    q: "What happens if my access stops working?",
    a: "Contact support with your order ID. After a quick check we replace the subscription free of charge for the remainder of your term.",
  },
  {
    q: "Which payment methods are supported?",
    a: "Card payments, popular local wallets and crypto are supported at checkout. Resellers can also settle on account balance.",
  },
  {
    q: "Can I upgrade an existing plan?",
    a: "Yes. Products with custom options list upgrade prices on their product page — support can also quote bespoke upgrades.",
  },
  {
    q: "Do you offer invoices for teams?",
    a: "Team members receive consolidated monthly invoices covering every order placed under the workspace.",
  },
];

function SupportPage() {
  const [sending, setSending] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold">Support</h1>
        <p className="mt-3 text-muted-foreground">
          Real people, 24/7. Reach us on Telegram for the fastest answer, or send a message and
          we'll reply by email.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <a
          href="https://t.me/subnexa"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/50"
        >
          <Send className="size-5 text-primary" />
          <h2 className="mt-3 font-semibold">Telegram channel</h2>
          <p className="text-sm text-muted-foreground">@subnexa</p>
        </a>
        <a
          href="https://t.me/subnexa_bot"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/50"
        >
          <MessageCircle className="size-5 text-primary" />
          <h2 className="mt-3 font-semibold">Official bot</h2>
          <p className="text-sm text-muted-foreground">Order status in seconds</p>
        </a>
        <a
          href="mailto:support@subnexa.com"
          className="rounded-xl border border-border/70 bg-card p-5 transition-colors hover:border-primary/50"
        >
          <Mail className="size-5 text-primary" />
          <h2 className="mt-3 font-semibold">Email</h2>
          <p className="text-sm text-muted-foreground">support@subnexa.com</p>
        </a>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <section>
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <form
          className="h-fit rounded-2xl border border-border/70 bg-card p-6 shadow-elevated"
          onSubmit={(e) => {
            e.preventDefault();
            setSending(true);
            setTimeout(() => {
              setSending(false);
              toast.success("Message sent", { description: "We usually reply within an hour." });
              (e.target as HTMLFormElement).reset();
            }, 600);
          }}
        >
          <h2 className="text-lg font-semibold">Send us a message</h2>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="s-name">Name</Label>
              <Input id="s-name" required placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-email">Email</Label>
              <Input id="s-email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-order">Order ID (optional)</Label>
              <Input id="s-order" placeholder="SNX-000000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-message">Message</Label>
              <Textarea id="s-message" rows={5} required placeholder="How can we help?" />
            </div>
          </div>
          <Button type="submit" className="mt-6 w-full" size="lg" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
