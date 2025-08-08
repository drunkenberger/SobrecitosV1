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
  Calendar
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import BudgetManager from "./budget/BudgetManager";
import ExpenseChart from "./budget/ExpenseChart";
import CategoryManager from "./budget/CategoryManager";
import SavingsGoals from "./budget/SavingsGoals";
import FuturePayments from "./budget/FuturePayments";
import ExpenseList from "./budget/ExpenseList";

export default function HomeSimple() {
  const { t } = useTranslation();
  const {
    monthlyBudget,
    additionalIncomes,
    expenses,
    categories,
    savingsGoals,
    addExpense,
    updateBudget,
    addIncome,
    deleteIncome,
    addCategory,
    updateCategory,
    deleteCategory,
    loadFromCloud
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        await loadFromCloud();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, [loadFromCloud]);

  // Calculate metrics
  const totalBudget = (monthlyBudget || 0) + (additionalIncomes || []).reduce((sum: any, inc: any) => sum + inc.amount, 0);
  const spentAmount = (expenses || []).reduce((sum: any, exp: any) => sum + exp.amount, 0);
  const remainingBalance = totalBudget - spentAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const chartData = (categories || []).map((cat: any) => ({
    name: cat.name,
    value: (expenses || [])
      .filter((exp: any) => exp.category_id === cat.id)
      .reduce((sum: any, exp: any) => sum + exp.amount, 0),
    color: cat.color,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Budget Dashboard</h1>
                <p className="text-gray-600">Manage your finances effectively</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white p-6 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="bg-white p-6 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Spent This Month</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(spentAmount)}</p>
              </div>
              <PieChart className="w-8 h-8 text-red-600" />
            </div>
          </Card>
          
          <Card className="bg-white p-6 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Remaining Balance</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(remainingBalance)}</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="bg-white p-6 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories?.length || 0}</p>
              </div>
              <ListChecks className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Budget Settings */}
          <Card className="bg-white border shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Budget Settings</h3>
                  <p className="text-sm text-gray-600">Manage your income and budget</p>
                </div>
              </div>
              <div className="space-y-4">
                <BudgetManager
                  monthlyBudget={monthlyBudget}
                  additionalIncomes={additionalIncomes}
                  onUpdateBudget={updateBudget}
                  onAddIncome={addIncome}
                  onDeleteIncome={deleteIncome}
                />
              </div>
            </div>
          </Card>

          {/* Expense Breakdown */}
          <Card className="bg-white border shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
                    <p className="text-sm text-gray-600">Visual breakdown of spending</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <ExpenseChart data={chartData} />
              </div>
            </div>
          </Card>

          {/* Category Management */}
          <Card className="bg-white border shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                  <p className="text-sm text-gray-600">Organize spending categories</p>
                </div>
              </div>
              <div className="space-y-4">
                <CategoryManager
                  categories={categories}
                  onAddCategory={addCategory}
                  onUpdateCategory={updateCategory}
                  onDeleteCategory={deleteCategory}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Savings Goals */}
          <Card className="bg-white border shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
                  <p className="text-sm text-gray-600">Track your financial goals</p>
                </div>
              </div>
              <div className="space-y-4">
                <SavingsGoals />
              </div>
            </div>
          </Card>

          {/* Future Payments */}
          <Card className="bg-white border shadow-sm">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Future Payments</h3>
                  <p className="text-sm text-gray-600">Upcoming bills and payments</p>
                </div>
              </div>
              <div className="space-y-4">
                <FuturePayments />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white border shadow-sm">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <ListChecks className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <p className="text-sm text-gray-600">Your latest financial activity</p>
              </div>
            </div>
            <div className="space-y-4">
              <ExpenseList />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}