import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type WalletTx = {
  id: string;
  type: "deposit" | "purchase";
  label: string;
  amount: number;
  at: string;
};

type WalletState = {
  balance: number;
  transactions: WalletTx[];
};

const STORAGE_KEY = "subnexa.wallet.v1";
const empty: WalletState = { balance: 0, transactions: [] };

type WalletContextValue = {
  balance: number;
  transactions: WalletTx[];
  hydrated: boolean;
  deposit: (amount: number, method: string) => void;
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

  const deposit = useCallback((amount: number, method: string) => {
    setState((s) => ({
      balance: Number((s.balance + amount).toFixed(2)),
      transactions: [
        {
          id: crypto.randomUUID(),
          type: "deposit",
          label: `Deposit via ${method}`,
          amount,
          at: new Date().toISOString(),
        },
        ...s.transactions,
      ].slice(0, 50),
    }));
  }, []);

  const charge = useCallback((amount: number, label: string) => {
    let ok = false;
    setState((s) => {
      if (s.balance + 1e-9 < amount) return s;
      ok = true;
      return {
        balance: Number((s.balance - amount).toFixed(2)),
        transactions: [
          { id: crypto.randomUUID(), type: "purchase", label, amount, at: new Date().toISOString() },
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
      hydrated,
      deposit,
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
    [state, hydrated, deposit, charge, depositOpen, requiredAmount],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
