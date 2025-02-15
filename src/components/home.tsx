import React from "react";
import { Link } from "react-router-dom";
import DataManager from "./budget/DataManager";
import DashboardHeader from "./budget/DashboardHeader";
import ExpenseChart from "./budget/ExpenseChart";
import ExpenseForm from "./budget/ExpenseForm";
import CategoryManager from "./budget/CategoryManager";
import BudgetManager from "./budget/BudgetManager";
import SavingsGoals from "./budget/SavingsGoals";
import BudgetAlerts from "./budget/BudgetAlerts";
import ExpenseList from "./budget/ExpenseList";
import { Card } from "./ui/card";
import {
  getStore,
  updateMonthlyBudget,
  addIncome,
  deleteIncome,
  addCategory,
  updateCategory,
  deleteCategory,
  addExpense,
  deleteExpense,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addFuturePayment,
  updateFuturePayment,
} from "@/lib/store";
import { Sparkles, Wallet, PieChart, ListChecks, Bot } from "lucide-react";
import FuturePayments from "./budget/FuturePayments";
import { Button } from "./ui/button";

import { AuthDialog } from "./auth/AuthDialog";
import { AIInsightsDialog } from "./budget/AIInsightsDialog";
import { getCurrentUser } from "@/lib/auth";
import { AIChatWindow } from "./budget/AIChatWindow";
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const [showAuth, setShowAuth] = React.useState(!getCurrentUser());
  const [store, setStore] = React.useState(getStore());
  const [showSettings, setShowSettings] = React.useState(false);

  React.useEffect(() => {
    if (!getCurrentUser()) {
      setShowAuth(true);
    }
  }, []);

  const refreshStore = React.useCallback(() => {
    setStore(getStore());
  }, []);

  if (showAuth) {
    return (
      <AuthDialog
        open={showAuth}
        onOpenChange={setShowAuth}
        onSuccess={() => setShowAuth(false)}
      />
    );
  }

  const totalBudget =
    store.monthlyBudget +
    (store.additionalIncomes || []).reduce((sum, inc) => sum + inc.amount, 0);
  const spentAmount = (store.expenses || []).reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );
  const remainingBalance = totalBudget - spentAmount;

  const chartData = (store.categories || []).map((cat) => ({
    category: cat.name,
    amount: (store.expenses || [])
      .filter((exp) => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0),
  }));

  const handleUpdateBudget = (amount: number) => {
    updateMonthlyBudget(amount);
    refreshStore();
  };

  const handleAddIncome = (income: { description: string; amount: number }) => {
    addIncome(income);
    refreshStore();
  };

  const handleDeleteIncome = (id: string) => {
    deleteIncome(id);
    refreshStore();
  };

  const handleAddCategory = (category: {
    name: string;
    color: string;
    budget: number;
  }) => {
    addCategory(category);
    refreshStore();
  };

  const handleUpdateCategory = (
    id: string,
    updates: { name?: string; color?: string; budget?: number },
  ) => {
    updateCategory(id, updates);
    refreshStore();
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    refreshStore();
  };

  const handleAddSavingsGoal = (goal: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    color: string;
  }) => {
    addSavingsGoal(goal);
    refreshStore();
  };

  const handleUpdateSavingsGoal = (id: string, updates: any) => {
    updateSavingsGoal(id, updates);
    refreshStore();
  };

  const handleDeleteSavingsGoal = (id: string) => {
    deleteSavingsGoal(id);
    refreshStore();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner with Gradient */}
      <div className="bg-gradient-to-r from-[#556B2F] via-[#556B2F] to-[#556B2F] text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <img
                src="https://lime-zygomorphic-vicuna-674.mypinata.cloud/ipfs/bafkreiairtotli5wav7jovqyea4b76kzsvnnccqwvo5ihvnwec426pgqz4"
                alt="Sobrecitos"
                className="h-24 w-auto"
              />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  {t('dashboard.header.title')}
                </h1>
                <p className="text-blue-100">
                  {t('dashboard.header.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <DataManager onDataChange={refreshStore} />
                <AIInsightsDialog />
              </div>
              <ExpenseForm
                categories={store.categories || []}
                onSubmit={(expense) => {
                  addExpense(expense);
                  refreshStore();
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Alerts Section */}
        <div className="animate-in fade-in slide-in-from-top duration-500">
          <BudgetAlerts />
        </div>

        {/* Overview Cards with Gradient Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-900 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-medium text-green-800 dark:text-green-300">
                {t('dashboard.overview.totalBudget')}
              </h3>
            </div>
            <p className="text-3xl font-bold text-green-700 dark:text-green-200 mt-2">
              ${totalBudget.toLocaleString()}
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-100 dark:border-red-900 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <PieChart className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
                {t('dashboard.overview.spentAmount')}
              </h3>
            </div>
            <p className="text-3xl font-bold text-red-700 dark:text-red-200 mt-2">
              ${spentAmount.toLocaleString()}
            </p>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-900 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">
                {t('dashboard.overview.remainingBalance')}
              </h3>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-200 mt-2">
              ${remainingBalance.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Charts Section with Gradient Background */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
          <ExpenseChart
            data={chartData}
            selectedView="pie"
            selectedTimeframe="month"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Expenses Section */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-900 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <ListChecks className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200">
                    Recent Transactions
                  </h2>
                </div>
                <ExpenseForm
                  categories={store.categories || []}
                  onSubmit={(expense) => {
                    addExpense(expense);
                    refreshStore();
                  }}
                />
              </div>
              <ExpenseList
                expenses={(store.expenses || []).map((exp) => ({
                  ...exp,
                  date: new Date(exp.date),
                }))}
                categories={store.categories || []}
                onDeleteExpense={(id) => {
                  deleteExpense(id);
                  refreshStore();
                }}
              />
            </div>
          </div>

          {/* Budget Management Section */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-900 shadow-md">
              <BudgetManager
                monthlyBudget={store.monthlyBudget}
                additionalIncomes={(store.additionalIncomes || []).map(
                  (inc) => ({
                    ...inc,
                    date: new Date(inc.date),
                  }),
                )}
                onUpdateMonthlyBudget={handleUpdateBudget}
                onAddIncome={handleAddIncome}
                onDeleteIncome={handleDeleteIncome}
              />
            </div>
          </div>
        </div>

        {/* Future Payments Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900 shadow-md mb-8">
          <FuturePayments
            payments={(store.futurePayments || []).map((p) => ({
              ...p,
              dueDate: new Date(p.dueDate),
            }))}
            onPaymentUpdate={(id, isPaid) => {
              updateFuturePayment(id, { isPaid });
              refreshStore();
            }}
            categories={(store.categories || []).map((c) => c.name)}
            onAddPayment={(payment) => {
              addFuturePayment({
                ...payment,
                dueDate: payment.dueDate.toISOString(),
              });
              refreshStore();
            }}
          />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Management Section */}
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-cyan-100 dark:border-cyan-900 shadow-md">
            <CategoryManager
              categories={store.categories || []}
              onAddCategory={handleAddCategory}
              onEditCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
          {/* Savings Goals Section */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-100 dark:border-violet-900 shadow-md">
            <SavingsGoals
              goals={store.savingsGoals || []}
              onAddGoal={handleAddSavingsGoal}
              onUpdateGoal={handleUpdateSavingsGoal}
              onDeleteGoal={handleDeleteSavingsGoal}
              monthlyIncome={totalBudget}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">{t('footer.about.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('footer.about.description')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.features.title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('footer.features.items.tracking')}</li>
                <li>{t('footer.features.items.planning')}</li>
                <li>{t('footer.features.items.reports')}</li>
                <li>{t('footer.features.items.sharing')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.resources.title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/help-center" className="hover:text-primary">
                    {t('navigation.help')}
                  </Link>
                </li>
                <li>{t('navigation.blog')}</li>
                <li>
                  <Link to="/app/faq" className="hover:text-primary">
                    {t('navigation.faq')}
                  </Link>
                </li>
                <li>{t('navigation.contact')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.legal.title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('footer.legal.privacy')}</li>
                <li>{t('footer.legal.terms')}</li>
                <li>{t('footer.legal.cookies')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('footer.copyright')}
          </div>
        </div>
      </footer>

      {/* AI Chat Window */}
      <AIChatWindow />
    </div>
  );
};

export default Home;
