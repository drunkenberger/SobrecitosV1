import React from "react";
import { Link } from "react-router-dom";
import DataManager from "./budget/DataManager";
import ExpenseChart from "./budget/ExpenseChart";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import CategoryManager from "./budget/CategoryManager";
import BudgetManager from "./budget/BudgetManager";
import SavingsGoals from "./budget/SavingsGoals";
import ExpenseList from "./budget/ExpenseList";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { Sparkles, Wallet, PieChart, ListChecks, Plus } from "lucide-react";
import FuturePayments from "./budget/FuturePayments";
import { AuthDialog } from "./auth/AuthDialog";
import { AIInsightsDialog } from "./budget/AIInsightsDialog";
import { getCurrentUser } from "@/lib/auth";
import { AIChatWindow } from "./budget/AIChatWindow";
import { useTranslation } from 'react-i18next';
import type { Category } from "@/types/category";
import type { BudgetStore } from "@/lib/store";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import type { ExpenseFormData } from '@/components/forms/ExpenseForm';
import type { ExpenseInput } from '@/lib/store';
import { DataSyncButton } from '@/components/DataSyncButton';

const Home = () => {
  const { t } = useTranslation();
  const [showAuth, setShowAuth] = React.useState(!getCurrentUser());
  const [showExpenseForm, setShowExpenseForm] = React.useState(false);
  
  const store = useStore();
  const {
    monthlyBudget,
    additionalIncomes,
    categories,
    expenses,
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
    loadFromCloud,
    saveToCloud
  } = useStore();

  React.useEffect(() => {
    if (!getCurrentUser()) {
      setShowAuth(true);
    }
    
    // Load initial data from cloud
    loadFromCloud();
    
    // Set up interval to periodically refresh data
    const refreshInterval = setInterval(() => {
      loadFromCloud();
    }, 30000); // Refresh every 30 seconds
    
    // Clean up interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [loadFromCloud]);

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
    (monthlyBudget || 0) +
    (additionalIncomes || []).reduce((sum: number, inc: any) => sum + inc.amount, 0);
  const spentAmount = (expenses || []).reduce(
    (sum: number, exp: any) => sum + exp.amount,
    0,
  );
  const remainingBalance = totalBudget - spentAmount;

  const chartData = (categories || []).map((cat) => ({
    category: cat.name,
    amount: (expenses || [])
      .filter((exp) => exp.category === cat.name)
      .reduce((sum: number, exp: any) => sum + exp.amount, 0),
  }));

  const handleUpdateBudget = async (amount: number) => {
    try {
      await updateMonthlyBudget(amount);
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Failed to update budget. Please try again.");
    }
  };

  const handleAddIncome = async (income: { description: string; amount: number }) => {
    try {
      await addIncome(income);
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Failed to add income. Please try again.");
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteIncome(id);
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income. Please try again.");
    }
  };

  const handleAddCategory = async (category: {
    name: string;
    color: string;
    budget: number;
  }) => {
    try {
      await addCategory(category);
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  const handleUpdateCategory = async (
    id: string,
    updates: { name?: string; color?: string; budget?: number },
  ) => {
    try {
      await updateCategory(id, updates);
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleAddSavingsGoal = async (goal: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    color: string;
  }) => {
    try {
      await addSavingsGoal(goal);
    } catch (error) {
      console.error("Error adding savings goal:", error);
      alert("Failed to add savings goal. Please try again.");
    }
  };

  const handleUpdateSavingsGoal = async (id: string, updates: any) => {
    try {
      await updateSavingsGoal(id, updates);
    } catch (error) {
      console.error("Error updating savings goal:", error);
      alert("Failed to update savings goal. Please try again.");
    }
  };

  const handleDeleteSavingsGoal = async (id: string) => {
    try {
      await deleteSavingsGoal(id);
    } catch (error) {
      console.error("Error deleting savings goal:", error);
      alert("Failed to delete savings goal. Please try again.");
    }
  };

  const handleAddExpense = async (expenseData: ExpenseFormData) => {
    try {
      console.log("Adding expense:", expenseData);
      const newExpense: ExpenseInput = {
        amount: expenseData.amount,
        category: expenseData.category,
        description: expenseData.description
      };
      
      await addExpense(newExpense);
      console.log("Expense added successfully");
      
      // Close form first for better UX
      setShowExpenseForm(false);
      
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('dashboard.header.title')}</h1>
        <div className="flex gap-2">
          <AIInsightsDialog />
          <DataSyncButton onSyncComplete={loadFromCloud} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Wallet className="w-5 h-5" /> {t('dashboard.budget.title')}
            </h2>
          </div>
          <BudgetManager
            monthlyBudget={monthlyBudget}
            additionalIncomes={additionalIncomes}
            onUpdateBudget={handleUpdateBudget}
            onAddIncome={handleAddIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5" /> {t('dashboard.expenses.title')}
            </h2>
            <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  {t('dashboard.expenses.addButton')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dashboard.expenses.addDialog.title')}</DialogTitle>
                </DialogHeader>
                <ExpenseForm
                  categories={categories}
                  onSubmit={handleAddExpense}
                  onCancel={() => setShowExpenseForm(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <ExpenseChart data={chartData} />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ListChecks className="w-5 h-5" /> {t('dashboard.categories.title')}
            </h2>
          </div>
          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <SavingsGoals
            goals={store.savingsGoals}
            onAddGoal={handleAddSavingsGoal}
            onUpdateGoal={handleUpdateSavingsGoal}
            onDeleteGoal={handleDeleteSavingsGoal}
          />
        </Card>

        <Card className="p-4">
          <FuturePayments
            payments={store.futurePayments}
            categories={categories}
            onAddPayment={addFuturePayment}
            onUpdatePayment={updateFuturePayment}
          />
        </Card>
      </div>

      <Card className="p-4">
        <ExpenseList
          expenses={expenses}
          categories={categories}
          onDeleteExpense={deleteExpense}
        />
      </Card>

      <AIChatWindow />
    </div>
  );
};

export default Home;
