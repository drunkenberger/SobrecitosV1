import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { 
  Wallet, 
  PieChart, 
  ListChecks, 
  DollarSign,
  Plus,
  Target,
  Calendar,
  TrendingDown,
  CreditCard,
  Receipt
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import BudgetManager from "./budget/BudgetManager";
import ExpenseChart from "./budget/ExpenseChart";
import CategoryManager from "./budget/CategoryManager";
import SavingsGoals from "./budget/SavingsGoals";
import FuturePayments from "./budget/FuturePayments";
import ExpenseList from "./budget/ExpenseList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ExpenseForm } from "./forms/ExpenseForm";
import { AIInsightsDialog } from "./budget/AIInsightsDialog";
import { DataSyncButton } from "./DataSyncButton";
import { AIChatWindow } from "./budget/AIChatWindow";
import { AllocateFundsDialog } from "./budget/AllocateFundsDialog";

export default function Home() {
  const { t } = useTranslation();
  const {
    monthlyBudget,
    additionalIncomes,
    expenses,
    categories,
    savingsGoals,
    futurePayments,
    addExpense,
    updateMonthlyBudget,
    addIncome,
    deleteIncome,
    addCategory,
    updateCategory,
    deleteCategory,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addFuturePayment,
    updateFuturePayment,
    deleteExpense,
    loadFromCloud,
    resetStore,
    allocateFundsToGoal
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        // Temporarily disable cloud loading to stop infinite loop
        // await loadFromCloud();
        console.log("App initialization - cloud loading disabled for testing");
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []); // Remove loadFromCloud dependency to prevent re-renders

  // Calculate metrics safely
  const totalBudget = (monthlyBudget || 0) + 
    (additionalIncomes || []).reduce((sum, inc) => sum + (inc?.amount || 0), 0);
  const spentAmount = (expenses || []).reduce((sum, exp) => sum + (exp?.amount || 0), 0);
  const remainingBalance = totalBudget - spentAmount;
  const spentPercentage = totalBudget > 0 ? (spentAmount / totalBudget) * 100 : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const chartData = (categories || [])
    .filter(cat => cat && cat.name)
    .map(cat => ({
      category: cat.name,
      amount: (expenses || [])
        .filter(exp => exp && exp.category === cat.name)
        .reduce((sum, exp) => sum + (exp?.amount || 0), 0),
      color: cat.color || '#94a3b8'
    }))
    .filter(item => item.amount > 0);

  const handleAddExpense = async (expenseData) => {
    const expense = {
      ...expenseData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    await addExpense(expense);
    setShowExpenseForm(false);
  };

  const handleUpdateBudget = async (amount) => {
    await updateMonthlyBudget(amount);
  };

  const handleAddIncome = async (income) => {
    await addIncome({
      ...income,
      id: Date.now().toString(),
      date: new Date().toISOString()
    });
  };

  const handleDeleteIncome = async (id) => {
    await deleteIncome(id);
  };

  const handleAddCategory = async (category) => {
    await addCategory({
      ...category,
      id: Date.now().toString()
    });
  };

  const handleUpdateCategory = async (id, updates) => {
    await updateCategory(id, updates);
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Professional Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('dashboard.header.title')}
                </h1>
                <p className="text-gray-600 mt-1">
                  Track expenses, manage budgets, achieve financial goals
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <AllocateFundsDialog 
                goals={savingsGoals || []}
                availableBalance={remainingBalance}
                onAllocateFunds={allocateFundsToGoal}
              />
              <AIInsightsDialog />
              <DataSyncButton onSyncComplete={loadFromCloud} />
            </div>
          </div>
        </div>

        {/* Stats Grid - Clean Professional Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white p-6 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Monthly
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
            </div>
          </Card>
          
          <Card className="bg-white p-6 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {spentPercentage.toFixed(0)}%
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Spent This Month</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(spentAmount)}</p>
            </div>
          </Card>
          
          <Card className="bg-white p-6 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                remainingBalance >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {remainingBalance >= 0 ? 'Available' : 'Over budget'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(remainingBalance)}</p>
            </div>
          </Card>
          
          <Card className="bg-white p-6 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ListChecks className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories?.length || 0}</p>
            </div>
          </Card>
        </div>

        {/* Main Dashboard Grid - Clean 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Budget Settings Card */}
          <Card className="bg-white shadow-lg border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-blue-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Budget Settings</h3>
                  <p className="text-sm text-gray-600">Manage income and budget</p>
                </div>
              </div>
              <div className="space-y-4">
                <BudgetManager
                  monthlyBudget={monthlyBudget}
                  additionalIncomes={additionalIncomes}
                  onUpdateMonthlyBudget={handleUpdateBudget}
                  onAddIncome={handleAddIncome}
                  onDeleteIncome={handleDeleteIncome}
                />
              </div>
            </div>
          </Card>

          {/* Expense Breakdown Card */}
          <Card className="bg-white shadow-lg border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-100 rounded-lg">
                    <PieChart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
                    <p className="text-sm text-gray-600">Spending visualization</p>
                  </div>
                </div>
                <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <ExpenseForm
                      categories={categories}
                      onSubmit={handleAddExpense}
                      onCancel={() => setShowExpenseForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-4 min-h-[300px] flex flex-col">
                <ExpenseChart 
                  data={chartData.length > 0 ? chartData : [
                    { category: "No expenses yet", amount: 0 }
                  ]} 
                />
              </div>
            </div>
          </Card>

          {/* Category Management Card */}
          <Card className="bg-white shadow-lg border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-purple-100 rounded-lg">
                  <ListChecks className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                  <p className="text-sm text-gray-600">Organize spending</p>
                </div>
              </div>
              <div className="space-y-4 max-h-[350px] overflow-y-auto">
                <CategoryManager
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Grid - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Savings Goals Card */}
          <Card className="bg-white shadow-lg border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-yellow-100 rounded-lg">
                  <Target className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
                  <p className="text-sm text-gray-600">Track financial goals</p>
                </div>
                <AllocateFundsDialog 
                  goals={savingsGoals || []}
                  availableBalance={remainingBalance}
                  onAllocateFunds={allocateFundsToGoal}
                  trigger={
                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                      <Plus className="w-4 h-4 mr-1" />
                      Allocate
                    </Button>
                  }
                />
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <SavingsGoals
                  goals={savingsGoals || []}
                  onAddGoal={addSavingsGoal}
                  onUpdateGoal={updateSavingsGoal}
                  onDeleteGoal={deleteSavingsGoal}
                />
              </div>
            </div>
          </Card>

          {/* Future Payments Card */}
          <Card className="bg-white shadow-lg border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-indigo-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Future Payments</h3>
                  <p className="text-sm text-gray-600">Upcoming bills</p>
                </div>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                <FuturePayments
                  payments={futurePayments || []}
                  categories={categories || []}
                  onAddPayment={addFuturePayment}
                  onUpdatePayment={updateFuturePayment}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Transactions - Full Width */}
        <Card className="bg-white shadow-lg border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-gray-100 rounded-lg">
                <Receipt className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <p className="text-sm text-gray-600">Your latest financial activity</p>
              </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              <ExpenseList
                expenses={expenses || []}
                categories={categories || []}
                onDeleteExpense={deleteExpense}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* AI Chat Window - Fixed Position */}
      {showAIChat && (
        <div className="fixed bottom-6 right-6 z-50">
          <AIChatWindow onClose={() => setShowAIChat(false)} />
        </div>
      )}
    </div>
  );
}