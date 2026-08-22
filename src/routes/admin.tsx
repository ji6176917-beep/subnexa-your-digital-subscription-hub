import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Lock, ShieldCheck, XCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatUSD } from "@/lib/catalog";
import { useWallet, type DepositRequest } from "@/lib/wallet";

const ADMIN_PASSCODE = "@50667811@";
const UNLOCK_KEY = "subnexa.admin.unlocked";

export const Route = createFileRoute("/admin")({
  head: () => {
    const title = "Deposit Approvals — SubNexa Admin";
    const description =
      "Review pending SubNexa wallet deposit requests, verify transaction references and approve or reject funding.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AdminRoute,
});

function AdminRoute() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem(UNLOCK_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!unlocked) {
    const onSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (value === ADMIN_PASSCODE) {
        try {
          sessionStorage.setItem(UNLOCK_KEY, "1");
        } catch {
          /* ignore */
        }
        setUnlocked(true);
      } else {
        setError(true);
        setValue("");
      }
    };

    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
        <form
          onSubmit={onSubmit}
          className="w-full rounded-2xl border border-border/70 bg-card p-8 shadow-lg"
        >
          <span className="bg-secondary flex size-11 items-center justify-center rounded-xl">
            <Lock className="size-5 text-primary" />
          </span>
          <h1 className="mt-5 text-2xl font-bold">Restricted area</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the admin passcode to review deposit approvals.
          </p>
          <div className="mt-6 space-y-2">
            <Label htmlFor="admin-passcode">Admin passcode</Label>
            <Input
              id="admin-passcode"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
            />
            {error && <p className="text-sm text-destructive">Incorrect passcode. Try again.</p>}
          </div>
          <Button type="submit" className="mt-5 w-full">
            Unlock admin
          </Button>
        </form>
      </div>
    );
  }

  return <AdminPage onLock={() => {
    try {
      sessionStorage.removeItem(UNLOCK_KEY);
    } catch {
      /* ignore */
    }
    setUnlocked(false);
    setValue("");
  }} />;
}

function StatusBadge({ status }: { status: DepositRequest["status"] }) {
  if (status === "approved") return <Badge className="bg-primary/20 text-primary">Approved</Badge>;
  if (status === "rejected") return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}

function AdminPage({ onLock }: { onLock: () => void }) {
  const { requests, hydrated, balance, approveRequest, rejectRequest } = useWallet();
  const pending = requests.filter((r) => r.status === "pending");
  const history = requests.filter((r) => r.status !== "pending");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="size-3.5" /> Admin
          </Badge>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Deposit approvals</h1>
          <p className="mt-2 text-muted-foreground">
            Verify transaction details, then approve to credit the wallet instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-border/70 bg-card px-5 py-3">
            <p className="text-xs text-muted-foreground">Wallet balance</p>
            <p className="text-2xl font-bold">{hydrated ? formatUSD(balance) : "—"}</p>
          </div>
          <Button variant="outline" size="sm" onClick={onLock}>
            <Lock className="size-4" /> Lock
          </Button>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Pending requests ({pending.length})</h2>
        <div className="mt-4 space-y-4">
          {pending.length === 0 && (
            <p className="rounded-xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
              No pending deposit requests.
            </p>
          )}
          {pending.map((r) => (
            <div key={r.id} className="rounded-xl border border-border/70 bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{r.methodLabel}</p>
                  <p className="text-2xl font-bold">
                    {formatUSD(r.amount)}
                    {r.bdtAmount ? (
                      <span className="ml-2 text-sm font-medium text-muted-foreground">
                        ৳{r.bdtAmount.toLocaleString()} @ {r.rate}
                      </span>
                    ) : null}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Reference</dt>
                  <dd className="truncate font-mono">{r.reference}</dd>
                </div>
                {r.senderPhone && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Sender phone</dt>
                    <dd className="font-mono">{r.senderPhone}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Submitted</dt>
                  <dd>{new Date(r.at).toLocaleString()}</dd>
                </div>
                {r.note && (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Proof / note</dt>
                    <dd className="mt-1 rounded-md bg-secondary/60 px-3 py-2 text-xs">{r.note}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    approveRequest(r.id);
                    toast.success("Deposit approved", {
                      description: `${formatUSD(r.amount)} credited to the wallet.`,
                    });
                  }}
                >
                  <CheckCircle2 className="size-4" /> Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    rejectRequest(r.id);
                    toast.error("Deposit rejected");
                  }}
                >
                  <XCircle className="size-4" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {history.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">History</h2>
          <div className="mt-4 divide-y divide-border/60 rounded-xl border border-border/70 bg-card">
            {history.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
                <div>
                  <p className="font-medium">
                    {formatUSD(r.amount)} · {r.methodLabel}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">{r.reference}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.reviewedAt ?? r.at).toLocaleString()}
                  </span>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
