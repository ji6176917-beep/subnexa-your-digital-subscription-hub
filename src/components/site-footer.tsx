import { Link } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";
import { categories } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gradient-primary flex size-8 items-center justify-center rounded-lg">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold">SubNexa</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The premium subscription marketplace. Verified accounts, instant delivery and
            round-the-clock human support.
          </p>
          <a
            href="https://t.me/subnexa"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Send className="size-4" /> Telegram support
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Marketplace</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/browse" className="hover:text-foreground">
                Browse all
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-foreground">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-foreground">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/reseller" className="hover:text-foreground">
                Reseller program
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Popular categories</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/browse"
                  search={{ category: c.slug, q: "" }}
                  className="hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/how-it-works" className="hover:text-foreground">
                How it works
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-foreground">
                Support & FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SubNexa. All prices in USD.
      </div>
    </footer>
  );
}
