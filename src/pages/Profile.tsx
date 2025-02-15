import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Wallet, PieChart, TrendingUp, Target } from "lucide-react";
import ExpenseChart from "@/components/budget/ExpenseChart";
import SEO from "@/components/SEO";

export default function Profile() {
  const user = getCurrentUser();
  const store = getStore();

  const totalBudget =
    store.monthlyBudget +
    (store.additionalIncomes || []).reduce((sum, inc) => sum + inc.amount, 0);
  const spentAmount = (store.expenses || []).reduce(
    (sum, exp) => sum + exp.amount,
    0,
  );
  const remainingBalance = totalBudget - spentAmount;

  // Calculate savings progress
  const totalSavingsGoal = (store.savingsGoals || []).reduce(
    (sum, goal) => sum + goal.targetAmount,
    0,
  );
  const currentSavings = (store.savingsGoals || []).reduce(
    (sum, goal) => sum + goal.currentAmount,
    0,
  );
  const savingsProgress = (currentSavings / totalSavingsGoal) * 100;

  // Prepare chart data
  const chartData = (store.categories || []).map((cat) => ({
    category: cat.name,
    amount: (store.expenses || [])
      .filter((exp) => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0),
  }));

  return (
    <div className="min-h-screen bg-background py-12">
      <SEO 
        title="My Profile - Sobrecitos Budget Manager"
        description="Manage your Sobrecitos profile settings, preferences, and personal budget configurations. Customize your family finance management experience."
        keywords="budget profile, personal settings, financial preferences, account management, budget customization, family finance settings"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt={user?.name}
            />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Financial Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Monthly Budget</h3>
            </div>
            <p className="text-3xl font-bold">
              ${totalBudget.toLocaleString()}
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Spent</span>
                <span>{((spentAmount / totalBudget) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(spentAmount / totalBudget) * 100} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Current Balance</h3>
            </div>
            <p className="text-3xl font-bold">
              ${remainingBalance.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Available to spend this month
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Savings Progress</h3>
            </div>
            <p className="text-3xl font-bold">
              ${currentSavings.toLocaleString()}
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Goal</span>
                <span>${totalSavingsGoal.toLocaleString()}</span>
              </div>
              <Progress value={savingsProgress} />
            </div>
          </Card>
        </div>

        {/* Expense Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Spending Breakdown</h3>
          </div>
          <ExpenseChart data={chartData} selectedView="pie" />
        </Card>
      </div>
    </div>
  );
}
