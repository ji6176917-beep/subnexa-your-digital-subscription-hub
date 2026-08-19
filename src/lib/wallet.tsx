import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type WalletTx = {
  id: string;
  type: "deposit" | "purchase";
  label: string;
  amount: number;
  at: string;
};

export type DepositMethod = "binance" | "usdt" | "epay" | "bdt";

export type DepositRequest = {
  id: string;
  method: DepositMethod;
  methodLabel: string;
  amount: number;
  bdtAmount?: number;
  rate?: number;
  reference: string;
  senderPhone?: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
  at: string;
  reviewedAt?: string;
};

type WalletState = {
  balance: number;
  transactions: WalletTx[];
  requests: DepositRequest[];
};

const STORAGE_KEY = "subnexa.wallet.v2";
const empty: WalletState = { balance: 0, transactions: [], requests: [] };

export const MIN_DEPOSIT = 3;

type WalletContextValue = {
  balance: number;
  transactions: WalletTx[];
  requests: DepositRequest[];
  hydrated: boolean;
  submitDeposit: (req: Omit<DepositRequest, "id" | "status" | "at">) => DepositRequest;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  charge: (amount: number, label: string) => boolean;
  depositOpen: boolean;
  openDeposit: (shortfall?: number) => void;
  closeDeposit: () => void;
  requiredAmount: number | null;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(empty);
  const [hydrated, setHydrated] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState<number | null>(null);

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

  const submitDeposit = useCallback((req: Omit<DepositRequest, "id" | "status" | "at">) => {
    const full: DepositRequest = {
      ...req,
      id: crypto.randomUUID(),
      status: "pending",
      at: new Date().toISOString(),
    };
    setState((s) => ({ ...s, requests: [full, ...s.requests].slice(0, 100) }));
    return full;
  }, []);

  const approveRequest = useCallback((id: string) => {
    setState((s) => {
      const req = s.requests.find((r) => r.id === id);
      if (!req || req.status !== "pending") return s;
      return {
        balance: Number((s.balance + req.amount).toFixed(2)),
        transactions: [
          {
            id: crypto.randomUUID(),
            type: "deposit" as const,
            label: `Deposit via ${req.methodLabel}`,
            amount: req.amount,
            at: new Date().toISOString(),
          },
          ...s.transactions,
        ].slice(0, 50),
        requests: s.requests.map((r) =>
          r.id === id ? { ...r, status: "approved" as const, reviewedAt: new Date().toISOString() } : r,
        ),
      };
    });
  }, []);

  const rejectRequest = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      requests: s.requests.map((r) =>
        r.id === id && r.status === "pending"
          ? { ...r, status: "rejected" as const, reviewedAt: new Date().toISOString() }
          : r,
      ),
    }));
  }, []);

  const charge = useCallback((amount: number, label: string) => {
    let ok = false;
    setState((s) => {
      if (s.balance + 1e-9 < amount) return s;
      ok = true;
      return {
        ...s,
        balance: Number((s.balance - amount).toFixed(2)),
        transactions: [
          { id: crypto.randomUUID(), type: "purchase" as const, label, amount, at: new Date().toISOString() },
          ...s.transactions,
        ].slice(0, 50),
      };
    });
    return ok;
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      balance: state.balance,
      transactions: state.transactions,
      requests: state.requests,
      hydrated,
      submitDeposit,
      approveRequest,
      rejectRequest,
      charge,
      depositOpen,
      requiredAmount,
      openDeposit: (shortfall?: number) => {
        setRequiredAmount(shortfall ?? null);
        setDepositOpen(true);
      },
      closeDeposit: () => {
        setDepositOpen(false);
        setRequiredAmount(null);
      },
    }),
    [state, hydrated, submitDeposit, approveRequest, rejectRequest, charge, depositOpen, requiredAmount],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
