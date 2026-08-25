import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Wallet } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { BdtPairLogo, PaymentLogo, type PaymentBrand } from "@/components/payment-logo";
import { formatUSD } from "@/lib/catalog";
import { MIN_DEPOSIT, useWallet, type DepositMethod } from "@/lib/wallet";

type MethodDef = {
  key: DepositMethod;
  name: string;
  short: string;
  brand?: PaymentBrand;
  instruction: string;
  referenceLabel: string;
  referencePlaceholder: string;
};

const methods: MethodDef[] = [
  {
    key: "binance",
    name: "Binance Pay (UID)",
    short: "Binance",
    brand: "binance",
    instruction:
      "Send the exact amount via Binance Pay to this UID and submit your Binance Order ID / TxID.",
    referenceLabel: "Binance Order ID / TxID",
    referencePlaceholder: "e.g. 1234567890123456789",
  },
  {
    key: "usdt",
    name: "USDT (ERC20)",
    short: "USDT",
    brand: "usdt",
    instruction: "Send USDT (ERC20 only) to this address and submit your Transaction Hash.",
    referenceLabel: "Transaction Hash",
    referencePlaceholder: "0x…",
  },
  {
    key: "epay",
    name: "Epay",
    short: "Epay",
    brand: "epay",
    instruction:
      "Transfer funds to this Epay email account and submit your Epay Batch/Transaction Number.",
    referenceLabel: "Epay Batch / Transaction Number",
    referencePlaceholder: "e.g. 887654321",
  },
  {
    key: "bdt",
    name: "BDT P2P (bKash / Nagad)",
    short: "bKash / Nagad",
    instruction:
      "Send the calculated BDT amount to the respective number and enter the sender phone number and TrxID below.",
    referenceLabel: "TrxID",
    referencePlaceholder: "e.g. BKX7A9QL21",
  },
];

const presets = [3, 10, 25, 50];

type BdtProvider = "bkash" | "nagad";

const bdtProviders = [
  {
    key: "bkash" as const,
    name: "bKash",
    rate: 123,
    number: "01761742529",
    numberLabel: "bKash personal (Send Money & Cash In)",
  },
  {
    key: "nagad" as const,
    name: "Nagad",
    rate: 130,
    number: "01850667811",
    numberLabel: "Nagad (Cash In ONLY)",
  },
];

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card px-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm font-medium">{value}</p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="shrink-0 gap-1"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
          } catch {
            /* ignore */
          }
          setCopied(true);
          toast.success(`${label} copied`);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

export function DepositDialog() {
  const { depositOpen, closeDeposit, requiredAmount, balance, submitDeposit } = useWallet();
  const [amount, setAmount] = useState("10");
  const [method, setMethod] = useState<DepositMethod>("binance");
  const [provider, setProvider] = useState<BdtProvider>("bkash");
  const [reference, setReference] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (depositOpen && requiredAmount != null) {
      setAmount(Math.max(MIN_DEPOSIT, Math.ceil(requiredAmount)).toString());
    }
  }, [depositOpen, requiredAmount]);

  const value = Number(amount);
  const amountValid = Number.isFinite(value) && value >= MIN_DEPOSIT;
  const activeProvider = bdtProviders.find((p) => p.key === provider)!;
  const rateNum = activeProvider.rate;
  const bdtTotal = useMemo(
    () => (amountValid ? Math.ceil(value * rateNum) : 0),
    [amountValid, value, rateNum],
  );

  const active = methods.find((m) => m.key === method)!;
  const refValid = reference.trim().length >= 4;
  const phoneValid = method !== "bdt" || /^01\d{9}$/.test(senderPhone.trim());
  const canSubmit = amountValid && refValid && phoneValid;

  const reset = () => {
    setReference("");
    setSenderPhone("");
    setNote("");
  };

  return (
    <Dialog open={depositOpen} onOpenChange={(o) => !o && closeDeposit()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="size-4 text-primary" /> Add funds to your wallet
          </DialogTitle>
          <DialogDescription>
            {requiredAmount != null
              ? `You need ${formatUSD(requiredAmount)} more to complete this order. Current balance ${formatUSD(balance)}.`
              : `Current balance ${formatUSD(balance)}. Minimum deposit is ${formatUSD(MIN_DEPOSIT)}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label htmlFor="deposit-amount">Amount (USD)</Label>
            <Input
              id="deposit-amount"
              type="number"
              min={MIN_DEPOSIT}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
            />
            {!amountValid && (
              <p className="mt-1.5 text-xs text-destructive">
                Minimum deposit amount is {formatUSD(MIN_DEPOSIT)}.
              </p>
            )}
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
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {methods.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMethod(m.key)}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors ${
                    method === m.key ? "border-primary bg-primary/10" : "border-border/70 hover:border-primary/40"
                  }`}
                >
                  {m.brand ? <PaymentLogo brand={m.brand} size={22} /> : <BdtPairLogo />}
                  <span className="text-sm font-medium">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border/70 bg-surface/50 p-4">
            <p className="text-sm text-muted-foreground">{active.instruction}</p>

            {method === "binance" && <CopyField label="Binance ID" value="1227980979" />}

            {method === "usdt" && (
              <>
                <CopyField label="Network" value="Ethereum (ERC20)" />
                <CopyField
                  label="Wallet address"
                  value="0xd20ce3b4dfc16a4cbbf61b073925b8f34cd21e6c"
                />
              </>
            )}

            {method === "epay" && <CopyField label="Epay email" value="ji6176917@gmail.com" />}

            {method === "bdt" && (
              <>
                <div className="grid gap-2 sm:grid-cols-2">
                  {bdtProviders.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setProvider(p.key)}
                      className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        provider === p.key
                          ? "border-primary bg-primary/10"
                          : "border-border/70 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <PaymentLogo brand={p.key} size={18} />
                        <div>
                          <p className="text-sm font-semibold">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Fixed rate ৳{p.rate} per $1
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/70 bg-card px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      Exchange rate (locked)
                    </p>
                    <p className="text-lg font-bold">৳{activeProvider.rate} = $1.00</p>
                  </div>
                  <div className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      You must pay
                    </p>
                    <p className="text-lg font-bold">
                      {bdtTotal ? `৳${bdtTotal.toLocaleString()}` : "—"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {amountValid
                        ? `${formatUSD(value)} × ${activeProvider.rate}`
                        : "Enter a valid amount"}
                    </p>
                  </div>
                </div>

                <CopyField label={activeProvider.numberLabel} value={activeProvider.number} />
                {provider === "nagad" && (
                  <p className="text-xs text-destructive">
                    Note: Send Money is NOT supported for Nagad — use Cash In only.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="space-y-3">
            {method === "bdt" && (
              <div>
                <Label htmlFor="sender-phone">Sender phone number</Label>
                <Input
                  id="sender-phone"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="01XXXXXXXXX"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="mt-2"
                />
                {senderPhone && !phoneValid && (
                  <p className="mt-1.5 text-xs text-destructive">Enter a valid 11-digit number.</p>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="deposit-ref">{active.referenceLabel}</Label>
              <Input
                id="deposit-ref"
                maxLength={120}
                placeholder={active.referencePlaceholder}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="mt-2"
              />
              {reference && !refValid && (
                <p className="mt-1.5 text-xs text-destructive">Enter a valid transaction reference.</p>
              )}
            </div>
            <div>
              <Label htmlFor="deposit-note">Transaction proof / note (optional)</Label>
              <Textarea
                id="deposit-note"
                maxLength={500}
                placeholder="Screenshot link or any detail that helps verification"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!canSubmit}
            onClick={() => {
              submitDeposit({
                method,
                methodLabel: method === "bdt" ? `BDT P2P · ${activeProvider.name}` : active.name,
                amount: Number(value.toFixed(2)),
                ...(method === "bdt"
                  ? { bdtAmount: bdtTotal, rate: rateNum, senderPhone: senderPhone.trim() }
                  : {}),
                reference: reference.trim(),
                ...(note.trim() ? { note: note.trim() } : {}),
              });
              reset();
              closeDeposit();
              toast.success("Deposit request submitted!", {
                description: "Status: Pending admin verification.",
              });
            }}
          >
            Submit deposit request {amountValid ? `· ${formatUSD(value)}` : ""}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Requests are credited to your wallet after admin verification.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
