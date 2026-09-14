import { Link } from "@tanstack/react-router";
import { Menu, Plus, Search, Sparkles, User, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatUSD } from "@/lib/catalog";
import { useWallet } from "@/lib/wallet";

const nav = [
  { to: "/browse", label: "Browse" },
  { to: "/categories", label: "Categories" },
  { to: "/pricing", label: "Pricing" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/support", label: "Support" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { balance, hydrated, openDeposit } = useWallet();
  const shown = hydrated ? formatUSD(balance) : "$0.00";


  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 sm:flex sm:gap-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="bg-gradient-primary flex size-8 items-center justify-center rounded-lg">
            <Sparkles className="size-4 text-primary-foreground" />
          </span>
          <span className="truncate font-display text-lg font-bold tracking-tight">SubNexa</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:ml-auto sm:gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Link to="/browse" aria-label="Search subscriptions">
              <Search className="size-4" />
            </Link>
          </Button>
          <span className="hidden sm:inline-flex"><ThemeToggle /></span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeposit()}
            className="gap-1.5 px-2 sm:gap-2 sm:px-3"
            aria-label={`Wallet balance ${shown}. Add funds`}
          >
            <Wallet className="size-4 text-primary" />
            <span className="font-semibold">{shown}</span>
            <span className="hidden sm:inline text-muted-foreground">· Deposit</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Account menu">
                <User className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Wallet</span>
                <span className="font-bold text-primary">{shown}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openDeposit()}>
                <Plus className="size-4" /> Add funds
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/browse">Browse subscriptions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/reseller">Become a reseller</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/support">Support</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link to="/browse">Get started</Link>
          </Button>


          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="px-4 pt-4 text-base">Menu</SheetTitle>
              <nav className="mt-2 flex flex-col gap-1 p-4">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    activeProps={{ className: "text-foreground bg-secondary" }}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  className="mt-3 gap-2"
                  onClick={() => {
                    setOpen(false);
                    openDeposit();
                  }}
                >
                  <Wallet className="size-4" /> Wallet · {shown}
                </Button>
                <Button asChild variant="secondary" onClick={() => setOpen(false)}>
                  <Link to="/browse">Get started</Link>
                </Button>
                <Button asChild variant="outline" onClick={() => setOpen(false)}>
                  <Link to="/reseller">Become a reseller</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
