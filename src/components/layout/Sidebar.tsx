import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  LayoutDashboard,
  LayoutList,
  TrendingUp,
  BarChart3,
  Clock,
  CreditCard,
  Building2,
  LineChart,
  HelpCircle,
  Settings,
  Wallet,
  PiggyBank,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStore, calculateRecommendedSavings } from "@/lib/store";

interface Account {
  name: string;
  balance: number;
  type: "credit" | "depository" | "investment" | "upcoming" | "savings";
}

interface SidebarProps {
  accounts: Account[];
  onError?: (error: Error) => void;
}

export default function Sidebar({ accounts, onError }: SidebarProps) {
  try {
    const store = getStore();
    const { recommendedSavings, availableForSavings } = calculateRecommendedSavings();

    // Calculate total upcoming payments
    const totalUpcomingPayments = (store.futurePayments || [])
      .filter(payment => !payment.isPaid)
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Add upcoming payments to accounts
    const modifiedAccounts = [
      ...accounts,
      {
        name: "Upcoming Payments",
        balance: totalUpcomingPayments,
        type: "upcoming" as const
      }
    ];

    const groupedAccounts = modifiedAccounts.reduce((acc, account) => {
      if (!acc[account.type]) {
        acc[account.type] = [];
      }
      acc[account.type].push(account);
      return acc;
    }, {} as Record<string, Account[]>);

    // Calculate total budget and spending
    const totalBudget = store.monthlyBudget + 
      (store.additionalIncomes || []).reduce((sum, inc) => sum + inc.amount, 0);
    const totalSpent = (store.expenses || []).reduce((sum, exp) => sum + exp.amount, 0);
    const remainingBudget = totalBudget - totalSpent;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const mainNavItems = [
      { name: "Dashboard", icon: LayoutDashboard, path: "/app" },
      { name: "Transactions", icon: LayoutList, path: "/app/transactions" },
      { name: "Cash flow", icon: TrendingUp, path: "/app/cash-flow" },
      { name: "Categories", icon: BarChart3, path: "/app/categories" },
      { name: "Recurrings", icon: Clock, path: "/app/recurrings" },
    ];

    return (
      <div className="h-full bg-[#0A0D14] text-white flex flex-col">
        {/* Search Section - Fixed at top */}
        <div className="p-4 border-b border-[#1A1F2E]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="sidebar-search"
              name="sidebar-search"
              type="text"
              placeholder="Search"
              className="w-full bg-[#1A1F2E] border-none pl-8 text-sm h-9 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 py-4">
            {/* Budget Overview Section */}
            <div className="mb-6 p-3 bg-[#1A1F2E] rounded-lg">
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                Budget Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Budget</span>
                  <span className="font-medium">{formatCurrency(totalBudget)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Spent</span>
                  <span className="text-red-400">{formatCurrency(totalSpent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Remaining</span>
                  <span className="text-green-400">{formatCurrency(remainingBudget)}</span>
                </div>
                <Progress 
                  value={(totalSpent / totalBudget) * 100}
                  className="h-2"
                  indicatorClassName={totalSpent > totalBudget ? "bg-red-500" : "bg-green-500"}
                />
              </div>
            </div>

            {/* Savings Overview */}
            <div className="mb-6 p-3 bg-[#1A1F2E] rounded-lg">
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                Savings Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current Savings</span>
                  <span className="text-blue-400">{formatCurrency(recommendedSavings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Recommended</span>
                  <span className="text-purple-400">{formatCurrency(recommendedSavings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Available</span>
                  <span className="text-green-400">{formatCurrency(availableForSavings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Accumulated Savings</span>
                  <span className="text-green-400">
                    {formatCurrency(
                      (store.savingsGoals || []).reduce(
                        (total, goal) => total + goal.currentAmount,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#1A1F2E] transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Accounts Section */}
            <div className="space-y-6">
              {Object.entries(groupedAccounts).map(([type, accounts]) => (
                <div key={type}>
                  <div className="flex items-center justify-between px-3 mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">
                      {type === "credit" ? "Credit Cards" : 
                       type === "upcoming" ? "Upcoming Payments" : 
                       type === "investment" ? "Investments" : ""}
                    </h3>
                    <span className="text-xs">▼</span>
                  </div>
                  {type === "credit" && accounts.map((account) => (
                    <div
                      key={account.name}
                      className="flex items-center justify-between px-3 py-2 hover:bg-[#1A1F2E] rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-4 w-4 text-red-400" />
                        <span className="text-sm">{account.name}</span>
                      </div>
                      <span className="text-sm text-red-400">{formatCurrency(account.balance)}</span>
                    </div>
                  ))}
                  {type === "upcoming" && (
                    <div
                      className="flex items-center justify-between px-3 py-2 hover:bg-[#1A1F2E] rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <CalendarDays className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">Total Due</span>
                      </div>
                      <span className="text-sm text-yellow-400">
                        {formatCurrency(accounts[0].balance)}
                      </span>
                    </div>
                  )}
                  {type === "investment" && accounts.map((account) => (
                    <div
                      key={account.name}
                      className="flex items-center justify-between px-3 py-2 hover:bg-[#1A1F2E] rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <LineChart className="h-4 w-4 text-green-400" />
                        <span className="text-sm">{account.name}</span>
                      </div>
                      <span className="text-sm text-green-400">{formatCurrency(account.balance)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  } catch (error) {
    console.error("Sidebar Error:", error);
    onError?.(error as Error);
    return null;
  }
} 