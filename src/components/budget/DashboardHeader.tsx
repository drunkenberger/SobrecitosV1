import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface DashboardHeaderProps {
  totalBudget: number;
  spentAmount: number;
  remainingBalance: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalBudget = 0,
  spentAmount = 0,
  remainingBalance = 0,
}) => {
  const { t } = useTranslation();
  const spentPercentage = totalBudget > 0 ? (spentAmount / totalBudget) * 100 : 0;

  return (
    <Card className="p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            {t('dashboard.overview.title')}
          </h1>
          <p className="text-muted-foreground">{t('dashboard.overview.subtitle')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4" /> {t('dashboard.overview.totalBudget')}
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
            {t('dashboard.overview.spent')}: ${spentAmount.toLocaleString()}
          </span>
          <span className="text-muted-foreground">
            <TrendingUp className="w-4 h-4 inline mr-1 text-green-500" />
            {t('dashboard.overview.remaining')}: ${remainingBalance.toLocaleString()}
          </span>
        </div>
        <Progress value={spentPercentage} className="h-2" />
      </div>
    </Card>
  );
};

export default DashboardHeader;
