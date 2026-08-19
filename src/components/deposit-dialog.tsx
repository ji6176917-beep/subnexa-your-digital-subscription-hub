import { useEffect, useState } from "react";
import { Banknote, Bitcoin, CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatUSD } from "@/lib/catalog";
import { useWallet } from "@/lib/wallet";

const methods = [
  {
    key: "card",
    icon: CreditCard,
    name: "Card (Visa / Mastercard)",
    detail: "Instant credit · 2.9% processor fee",
  },
  {
    key: "crypto",
    icon: Bitcoin,
    name: "Crypto (USDT TRC20)",
    detail: "Send to TXn9…SubNexa · credited after 1 confirmation",
  },
  {
    key: "bank",
    icon: Banknote,
    name: "Bank / Mobile transfer",
    detail: "Send with your email as reference · credited within 30 min",
  },
];

const presets = [10, 25, 50, 100];

export function DepositDialog() {
  const { depositOpen, closeDeposit, requiredAmount, balance, deposit } = useWallet();
  const [amount, setAmount] = useState("25");
  const [method, setMethod] = useState("card");

  useEffect(() => {
    if (depositOpen && requiredAmount != null) {
      setAmount(Math.max(5, Math.ceil(requiredAmount)).toString());
    }
  }, [depositOpen, requiredAmount]);

  const value = Number(amount);
  const valid = Number.isFinite(value) && value > 0;

  return (
    <Dialog open={depositOpen} onOpenChange={(o) => !o && closeDeposit()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="size-4 text-primary" /> Add funds to your wallet
          </DialogTitle>
          <DialogDescription>
            {requiredAmount != null
              ? `You need ${formatUSD(requiredAmount)} more to complete this order. Current balance ${formatUSD(balance)}.`
              : `Current balance ${formatUSD(balance)}. Top up once, then buy any subscription instantly.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="deposit-amount">Amount (USD)</Label>
            <Input
              id="deposit-amount"
              type="number"
              min={1}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {presets.map((p) => (
                <Button key={p} type="button" size="sm" variant="secondary" onClick={() => setAmount(String(p))}>
                  ${p}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Payment method</p>
            <div className="mt-2 space-y-2">
              {methods.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMethod(m.key)}
                  className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                    method === m.key ? "border-primary bg-primary/10" : "border-border/70 hover:border-primary/40"
                  }`}
                >
                  <m.icon className="mt-0.5 size-4 text-primary" />
                  <span>
                    <span className="block text-sm font-medium">{m.name}</span>
                    <span className="block text-xs text-muted-foreground">{m.detail}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <ol className="space-y-1 rounded-lg border border-border/70 bg-surface/50 p-4 text-xs text-muted-foreground">
            <li>1. Choose an amount and a payment method.</li>
            <li>2. Complete the payment using the details shown above.</li>
            <li>3. Funds appear in your SubNexa wallet — then click Buy now on any product.</li>
          </ol>

          <Button
            className="w-full"
            size="lg"
            disabled={!valid}
            onClick={() => {
              const m = methods.find((x) => x.key === method)!;
              deposit(Number(value.toFixed(2)), m.name);
              closeDeposit();
              toast.success("Funds added", {
                description: `${formatUSD(value)} credited to your wallet.`,
              });
            }}
          >
            Deposit {valid ? formatUSD(value) : ""}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo wallet — payments are simulated until the payment provider is connected.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
