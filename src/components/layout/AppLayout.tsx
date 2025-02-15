import React, { useState, useEffect, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { getStore } from "@/lib/store";
import { useTranslation } from 'react-i18next';

// Use the same Account interface as Sidebar
interface Account {
  name: string;
  balance: number;
  type: "credit" | "depository" | "investment" | "upcoming" | "savings";
}

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sidebarError, setSidebarError] = useState<Error | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const store = getStore();
    
    // Transform store data into accounts
    const storeAccounts: Account[] = [
      // Main Account (Current Balance)
      {
        name: "Main Account",
        balance: store.monthlyBudget + 
          (store.additionalIncomes || []).reduce((sum, inc) => sum + inc.amount, 0) -
          (store.expenses || []).reduce((sum, exp) => sum + exp.amount, 0),
        type: "depository" as const
      },

      // Savings Goals
      ...(store.savingsGoals || []).map(goal => ({
        name: goal.name,
        balance: goal.currentAmount,
        type: "savings" as const
      })),

      // Investment Accounts (placeholders for future module)
      {
        name: "Coinbase",
        balance: 0, // Will be connected in future
        type: "investment" as const
      },
      {
        name: "Robinhood",
        balance: 0, // Will be connected in future
        type: "investment" as const
      },

      // Credit Card Debt
      {
        name: t('accounts.creditCard'),
        balance: (store.futurePayments || [])
          .filter(payment => 
            payment.category?.toLowerCase().includes('credit card') && 
            !payment.isPaid
          )
          .reduce((sum, payment) => sum + payment.amount, 0),
        type: "credit" as const
      },

      // Store Credit
      {
        name: t('accounts.storeCredit'),
        balance: (store.futurePayments || [])
          .filter(payment => 
            payment.category?.toLowerCase().includes('store credit') && 
            !payment.isPaid
          )
          .reduce((sum, payment) => sum + payment.amount, 0),
        type: "credit" as const
      },

      // Other Debt
      {
        name: t('accounts.personalLoan'),
        balance: (store.futurePayments || [])
          .filter(payment => 
            payment.category?.toLowerCase().includes('loan') && 
            !payment.isPaid
          )
          .reduce((sum, payment) => sum + payment.amount, 0),
        type: "credit" as const
      },
      {
        name: t('accounts.mortgage'),
        balance: (store.futurePayments || [])
          .filter(payment => 
            payment.category?.toLowerCase().includes('mortgage') && 
            !payment.isPaid
          )
          .reduce((sum, payment) => sum + payment.amount, 0),
        type: "credit" as const
      }
    ].filter(account => 
      // Show all investment accounts (even with 0 balance) but filter others
      account.type === "investment" || account.balance > 0
    );

    setAccounts(storeAccounts);
  }, []); // Consider adding store as a dependency if you want real-time updates

  if (sidebarError) {
    console.error("Sidebar Error:", sidebarError);
    // Render fallback UI
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        <div className="pt-16">
          <div className="flex">
            <div className="fixed left-0 top-16 bottom-0 w-64 bg-[#0A0D14] text-white p-4">
              <p>Error loading sidebar. Please refresh the page.</p>
            </div>
            <div className="flex-1 ml-64">
              <div className="max-w-[1600px] mx-auto px-4 py-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Layout */}
      <div className="flex h-screen pt-16">
        {/* Sidebar */}
        <div className="fixed left-0 top-16 bottom-0 w-64 z-40 bg-[#0A0D14]">
          <React.Suspense 
            fallback={
              <div className="h-full bg-[#0A0D14] text-white p-4">
                Loading sidebar...
              </div>
            }
          >
            <Sidebar 
              accounts={accounts} 
              onError={(error) => setSidebarError(error)}
            />
          </React.Suspense>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 overflow-auto">
          <div className="max-w-[1600px] mx-auto px-4 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 