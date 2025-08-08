import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { getStore, getStoreSynced } from "@/lib/store";
import { useTranslation } from 'react-i18next';

// Use the same Account interface as Sidebar
interface Account {
  name: string;
  balance: number;
  type: "credit" | "depository" | "investment" | "upcoming" | "savings";
}

export default function AppLayout() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sidebarError, setSidebarError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const store = await getStore();
        
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

          // Investment Accounts
          ...(store.investments || []).map(investment => ({
            name: investment.name,
            balance: investment.currentValue,
            type: "investment" as const
          })),

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
      } catch (error) {
        console.error("Error loading data:", error);
        setSidebarError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

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
              <p>{t('errors.sidebarLoading')}</p>
            </div>
            <div className="flex-1 ml-64">
              <div className="max-w-[1600px] mx-auto px-4 py-6">
                <Outlet />
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
        <div className="fixed left-0 top-16 bottom-0 w-64 z-40 bg-[#0A0D14] hidden md:block pointer-events-auto">
          <React.Suspense 
            fallback={
              <div className="h-full bg-[#0A0D14] text-white p-4">
                <div className="flex justify-center items-center h-full">
                  <div className="text-sm">{t('common.loading')}</div>
                </div>
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
        <div className="flex-1 md:ml-64 overflow-auto">
          <div className="max-w-[1600px] mx-auto px-4 py-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
} 