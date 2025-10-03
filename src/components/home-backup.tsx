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
import { 
  Sparkles, 
  Wallet, 
  PieChart, 
  ListChecks, 
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
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
import { cn } from "@/lib/utils";

// Clean Financial Stat Card Component with Fixed Layout
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  className 
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="w-3 h-3 text-emerald-600" />;
      case 'down':
        return <ArrowDownRight className="w-3 h-3 text-red-500" />;
      default:
        return <Activity className="w-3 h-3 text-slate-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600 bg-emerald-50';
      case 'down':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <Card className={cn(
      "bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 h-full",
      className
    )}>
      <div className="p-6 h-full flex flex-col">
        {/* Header with Icon and Trend */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0",
              getTrendColor()
            )}>
              {getTrendIcon()}
              <span className="whitespace-nowrap">{trendValue}</span>
            </div>
          )}
        </div>
        
        {/* Value and Title with Proper Spacing */}
        <div className="flex-1 space-y-2">
          <p className="text-2xl font-bold text-gray-900 leading-none break-words">
            {value}
          </p>
          <p className="text-sm font-medium text-gray-500 break-words">
            {title}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Clean Section Header Component with No Overlaps
const SectionHeader = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  action
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  action?: React.ReactNode;
}) => (
  <div className="pb-4 mb-6 border-b border-gray-100">
    <div className="flex flex-col space-y-4">
      {/* Title Row */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 break-words">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 break-words">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Action Row - Completely Separate */}
      {action && (
        <div className="flex justify-end">
          <div className="flex-shrink-0">
            {action}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Clean Card Wrapper Component
const DashboardCard = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={cn(
    "bg-white border border-gray-200 shadow-sm h-full",
    className
  )}>
    <div className="p-6 h-full flex flex-col">
      {children}
    </div>
  </Card>
);

const Home = () => {
  const { t } = useTranslation();
  const [showAuth, setShowAuth] = React.useState(!getCurrentUser());
  const [showExpenseForm, setShowExpenseForm] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [welcomeMessage, setWelcomeMessage] = React.useState("");
  
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
    const initializeApp = async () => {
      if (!getCurrentUser()) {
        setShowAuth(true);
        return;
      }
      
      try {
        setIsLoading(true);
        await loadFromCloud();
        
        // Set welcome message based on time of day
        const hour = new Date().getHours();
        if (hour < 12) setWelcomeMessage("Good morning! Ready to manage your budget?");
        else if (hour < 18) setWelcomeMessage("Good afternoon! Let's check your finances.");
        else setWelcomeMessage("Good evening! Time to review your spending.");
        
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
    
    // Set up interval to periodically refresh data
    const refreshInterval = setInterval(() => {
      if (getCurrentUser()) {
        loadFromCloud();
      }
    }, 30000); // Refresh every 30 seconds
    
    // Clean up interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [loadFromCloud]);

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AuthDialog
          open={showAuth}
          onOpenChange={setShowAuth}
          onSuccess={() => setShowAuth(false)}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Loading your financial data...
          </h2>
          <p className="text-sm text-gray-500">
            Setting up your personalized dashboard
          </p>
        </div>
      </div>
    );
  }

  // Calculate financial metrics
  const totalBudget =
    (monthlyBudget || 0) +
    (additionalIncomes || []).reduce((sum: number, inc: any) => sum + inc.amount, 0);
  const spentAmount = (expenses || []).reduce(
    (sum: number, exp: any) => sum + exp.amount,
    0,
  );
  const remainingBalance = totalBudget - spentAmount;
  const spentPercentage = totalBudget > 0 ? (spentAmount / totalBudget) * 100 : 0;

  const chartData = (categories || []).map((cat) => ({
    category: cat.name,
    amount: (expenses || [])
      .filter((exp) => exp.category === cat.name)
      .reduce((sum: number, exp: any) => sum + exp.amount, 0),
  }));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Event handlers
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        
        {/* Clean Header Section - No Overlapping */}
        <DashboardCard className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0 p-3 bg-blue-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                  {t('dashboard.header.title')}
                </h1>
                <p className="text-gray-600 mt-2 break-words">
                  {welcomeMessage}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-shrink-0">
              <AIInsightsDialog />
              <DataSyncButton onSyncComplete={loadFromCloud} />
            </div>
          </div>
        </DashboardCard>

        {/* Financial Overview Stats - Equal Height Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Budget"
            value={formatCurrency(totalBudget)}
            icon={DollarSign}
            trend="up"
            trendValue="+2.5%"
          />
          <StatCard
            title="Spent This Month"
            value={formatCurrency(spentAmount)}
            icon={TrendingDown}
            trend={spentPercentage > 80 ? "down" : "neutral"}
            trendValue={`${spentPercentage.toFixed(1)}%`}
          />
          <StatCard
            title="Remaining Balance"
            value={formatCurrency(remainingBalance)}
            icon={Wallet}
            trend={remainingBalance > 0 ? "up" : "down"}
            trendValue={remainingBalance > 0 ? "Available" : "Over budget"}
          />
          <StatCard
            title="Active Categories"
            value={categories?.length?.toString() || "0"}
            icon={ListChecks}
            trend="neutral"
            trendValue="Categories"
          />
        </div>

        {/* Main Dashboard Grid - Clean 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
          
          {/* Budget Settings Card */}
          <DashboardCard>
            <SectionHeader
              title={t('dashboard.budget.title')}
              subtitle="Manage your income and monthly budget"
              icon={Wallet}
            />
            <div className="flex-1 mt-4">
              <BudgetManager
                monthlyBudget={monthlyBudget}
                additionalIncomes={additionalIncomes}
                onUpdateMonthlyBudget={handleUpdateBudget}
                onAddIncome={handleAddIncome}
                onDeleteIncome={deleteIncome}
              />
            </div>
          </DashboardCard>

          {/* Expense Breakdown Card */}
          <DashboardCard>
            <SectionHeader
              title={t('dashboard.expenses.title')}
              subtitle="Visual breakdown of your spending"
              icon={PieChart}
              action={
                <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
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
              }
            />
            <div className="flex-1 mt-4">
              <ExpenseChart data={chartData} />
            </div>
          </DashboardCard>

          {/* Category Management Card */}
          <DashboardCard className="lg:col-span-2 xl:col-span-1">
            <SectionHeader
              title={t('dashboard.categories.title')}
              subtitle="Organize your spending categories"
              icon={ListChecks}
            />
            <div className="flex-1 mt-4">
              <CategoryManager
                categories={categories}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </div>
          </DashboardCard>
          
        </div>

        {/* Goals and Future Planning - Clean 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Savings Goals Card */}
          <DashboardCard>
            <SectionHeader
              title="Savings Goals"
              subtitle="Track your financial milestones"
              icon={Target}
            />
            <div className="flex-1 mt-4">
              <SavingsGoals
                goals={store.savingsGoals}
                onAddGoal={handleAddSavingsGoal}
                onUpdateGoal={handleUpdateSavingsGoal}
                onDeleteGoal={handleDeleteSavingsGoal}
              />
            </div>
          </DashboardCard>

          {/* Future Payments Card */}
          <DashboardCard>
            <SectionHeader
              title="Future Payments"
              subtitle="Upcoming and recurring expenses"
              icon={Calendar}
            />
            <div className="flex-1 mt-4">
              <FuturePayments
                payments={store.futurePayments}
                categories={categories}
                onAddPayment={addFuturePayment}
                onUpdatePayment={updateFuturePayment}
              />
            </div>
          </DashboardCard>
          
        </div>

        {/* Recent Transactions - Full Width Clean Card */}
        <DashboardCard>
          <SectionHeader
            title="Recent Transactions"
            subtitle="Your latest expenses and activities"
            icon={Activity}
          />
          <div className="flex-1 mt-4">
            <ExpenseList
              expenses={expenses}
              categories={categories}
              onDeleteExpense={deleteExpense}
            />
          </div>
        </DashboardCard>

        {/* AI Chat Window - Clean Fixed Positioning */}
        <div className="fixed bottom-6 right-6 z-50">
          <AIChatWindow />
        </div>
        
      </div>
    </div>
  );
};

export default Home;