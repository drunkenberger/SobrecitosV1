import React from "react";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardHeaderProps {
  totalBudget?: number;
  spentAmount?: number;
  remainingBalance?: number;
}

const DashboardHeader = ({
  totalBudget = 2000,
  spentAmount = 1250,
  remainingBalance = 750,
}: DashboardHeaderProps) => {
  const spentPercentage = (spentAmount / totalBudget) * 100;

  return (
    <Card className="p-6 w-full h-[120px]">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            Monthly Budget Overview
          </h1>
          <p className="text-muted-foreground">Track your household expenses</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Total Budget
          </p>
          <p className="text-2xl font-bold text-foreground">
            ${totalBudget.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            <TrendingDown className="w-4 h-4 inline mr-1 text-red-500" />
            Spent: ${spentAmount.toLocaleString()}
          </span>
          <span className="text-muted-foreground">
            <TrendingUp className="w-4 h-4 inline mr-1 text-green-500" />
            Remaining: ${remainingBalance.toLocaleString()}
          </span>
        </div>
        <Progress
          value={spentPercentage}
          className="h-2"
          indicatorClassName={`${spentPercentage > 90 ? "bg-red-500" : spentPercentage > 75 ? "bg-yellow-500" : "bg-green-500"}`}
        />
      </div>
    </Card>
  );
};

export default DashboardHeader;
