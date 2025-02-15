import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
  Plus,
  X,
  DollarSign,
  Wallet,
  Calendar,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { es } from 'date-fns/locale';

interface Income {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

interface BudgetManagerProps {
  monthlyBudget?: number;
  additionalIncomes?: Income[];
  onUpdateMonthlyBudget?: (amount: number) => void;
  onAddIncome?: (income: Omit<Income, "id" | "date">) => void;
  onDeleteIncome?: (id: string) => void;
}

const defaultIncomes: Income[] = [
  {
    id: "1",
    description: "Freelance Project",
    amount: 500,
    date: new Date(),
  },
  {
    id: "2",
    description: "Part-time Work",
    amount: 300,
    date: new Date(),
  },
];

const BudgetManager = ({
  monthlyBudget = 2000,
  additionalIncomes = defaultIncomes,
  onUpdateMonthlyBudget = () => {},
  onAddIncome = () => {},
  onDeleteIncome = () => {},
}: BudgetManagerProps) => {
  const { t, i18n } = useTranslation();
  const [isEditingBudget, setIsEditingBudget] = React.useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = React.useState(
    monthlyBudget.toString(),
  );
  const [newIncomeAmount, setNewIncomeAmount] = React.useState("");
  const [newIncomeDescription, setNewIncomeDescription] = React.useState("");

  const totalAdditionalIncome = additionalIncomes.reduce(
    (sum, income) => sum + income.amount,
    0,
  );

  // Calculate days left in the month
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysLeftInMonth = lastDayOfMonth.getDate() - today.getDate();

  // Calculate daily budget
  const totalBudget = monthlyBudget + totalAdditionalIncome;
  const dailyBudget = totalBudget / lastDayOfMonth.getDate();
  const remainingDailyBudget =
    (totalBudget / lastDayOfMonth.getDate()) * daysLeftInMonth;

  return (
    <Card className="w-full p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
              <Wallet className="w-6 h-6" /> {t('dashboard.budgetSettings.title')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('dashboard.budgetSettings.subtitle')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {t('dashboard.budgetSettings.additionalIncome.totalLabel')}
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              +${totalAdditionalIncome.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{t('dashboard.budgetSettings.monthlyOverview.daysLeft')}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {daysLeftInMonth}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.budgetSettings.monthlyOverview.monthEnds')} {lastDayOfMonth.toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US')}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{t('dashboard.budgetSettings.monthlyOverview.dailyBudget')}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${dailyBudget.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              ${remainingDailyBudget.toFixed(2)} {t('dashboard.budgetSettings.monthlyOverview.remainingDaily')}
            </p>
          </div>
        </div>

        <div className="p-4 bg-accent/50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-foreground">
                {t('dashboard.budgetSettings.monthlyBudget.title')}
              </h3>
              {!isEditingBudget ? (
                <p className="text-2xl font-bold text-foreground">
                  ${Number(monthlyBudget).toLocaleString()}
                </p>
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="number"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    className="w-[150px]"
                  />
                  <Button
                    onClick={() => {
                      onUpdateMonthlyBudget(Number(newBudgetAmount));
                      setIsEditingBudget(false);
                    }}
                  >
                    {t('common.save')}
                  </Button>
                </div>
              )}
            </div>
            {!isEditingBudget && (
              <Button
                variant="outline"
                onClick={() => setIsEditingBudget(true)}
                className="w-[150px]"
              >
                {t('common.edit')}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-foreground">
              {t('dashboard.budgetSettings.additionalIncome.title')}
            </h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold w-[180px]">
                  <Plus size={16} /> {t('dashboard.budgetSettings.additionalIncome.addButton')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('dashboard.budgetSettings.additionalIncome.dialog.title')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>{t('dashboard.budgetSettings.additionalIncome.dialog.description')}</Label>
                    <Input
                      placeholder={t('dashboard.budgetSettings.additionalIncome.dialog.descriptionPlaceholder')}
                      value={newIncomeDescription}
                      onChange={(e) => setNewIncomeDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('dashboard.budgetSettings.additionalIncome.dialog.amount')}</Label>
                    <Input
                      type="number"
                      placeholder={t('dashboard.budgetSettings.additionalIncome.dialog.amountPlaceholder')}
                      value={newIncomeAmount}
                      onChange={(e) => setNewIncomeAmount(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      onAddIncome({
                        description: newIncomeDescription,
                        amount: Number(newIncomeAmount),
                      });
                      setNewIncomeDescription("");
                      setNewIncomeAmount("");
                    }}
                  >
                    {t('dashboard.budgetSettings.additionalIncome.dialog.addButton')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {additionalIncomes.map((income) => (
                <div
                  key={income.id}
                  className="flex items-center justify-between p-3 border rounded-lg border-border bg-card"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {income.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {income.date.toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      +${income.amount.toLocaleString()}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeleteIncome(income.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};

export default BudgetManager;
