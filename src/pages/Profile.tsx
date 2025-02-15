import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { getStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PieChart, Wallet, TrendingUp, Target } from "lucide-react";
import ExpenseChart from "@/components/budget/ExpenseChart";
import SEO from "@/components/SEO";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Income {
  amount: number;
}

interface Expense {
  amount: number;
  category: string;
}

interface SavingsGoal {
  targetAmount: number;
  currentAmount: number;
  name: string;
}

export default function Profile() {
  const { t } = useTranslation();
  const user = getCurrentUser();
  const store = getStore();

  const totalBudget =
    store.monthlyBudget +
    (store.additionalIncomes || []).reduce((sum: number, inc: Income) => sum + inc.amount, 0);
  const spentAmount = (store.expenses || []).reduce(
    (sum: number, exp: Expense) => sum + exp.amount,
    0,
  );

  // Calculate current savings
  const currentSavings = (store.savingsGoals || []).reduce(
    (sum: number, goal: SavingsGoal) => sum + goal.currentAmount,
    0,
  );

  // Prepare chart data
  const chartData = (store.categories || []).map((cat) => ({
    category: cat.name,
    amount: (store.expenses || [])
      .filter((exp: Expense) => exp.category === cat.name)
      .reduce((sum: number, exp: Expense) => sum + exp.amount, 0),
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
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <CardTitle>{t('profile.stats.totalBudget')}</CardTitle>
              </div>
              <CardDescription>{t('profile.stats.totalBudgetDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${totalBudget.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle>{t('profile.stats.monthlySpending')}</CardTitle>
              </div>
              <CardDescription>{t('profile.stats.monthlySpendingDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${spentAmount.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle>{t('profile.stats.savingsGoals')}</CardTitle>
              </div>
              <CardDescription>{t('profile.stats.savingsGoalsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${currentSavings.toLocaleString()}
              </p>
            </CardContent>
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
