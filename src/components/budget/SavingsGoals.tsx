import React from "react";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Target, Plus, X, Edit2, Save, Calendar, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  SavingsGoal,
  calculateRecommendedSavings,
  distributeAutoSavings,
} from "@/lib/store";
import { useTranslation } from 'react-i18next';

interface SavingsGoalsProps {
  goals?: SavingsGoal[];
  onAddGoal?: (goal: Omit<SavingsGoal, "id">) => void;
  onUpdateGoal?: (id: string, updates: Partial<SavingsGoal>) => void;
  onDeleteGoal?: (id: string) => void;
  monthlyIncome?: number;
}

const SavingsGoals = ({
  goals = [],
  onAddGoal = () => {},
  onUpdateGoal = () => {},
  onDeleteGoal = () => {},
  monthlyIncome = 0,
}: SavingsGoalsProps) => {
  const { t } = useTranslation();
  const [editingGoal, setEditingGoal] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [newGoalName, setNewGoalName] = React.useState("");
  const [newGoalAmount, setNewGoalAmount] = React.useState("");
  const [newGoalDeadline, setNewGoalDeadline] = React.useState("");
  const [newGoalColor, setNewGoalColor] = React.useState("#4CAF50");
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const {
    recommendedSavings,
    availableForSavings,
    totalIncome,
    savingsPercentage,
  } = calculateRecommendedSavings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName || !newGoalAmount || !newGoalDeadline) return;

    onAddGoal({
      name: newGoalName,
      targetAmount: Number(newGoalAmount),
      currentAmount: 0,
      deadline: new Date(newGoalDeadline).toISOString(),
      color: newGoalColor,
    });

    // Reset form
    setNewGoalName("");
    setNewGoalAmount("");
    setNewGoalDeadline("");
    setNewGoalColor("#4CAF50");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('dashboard.savingsGoals.title')}</h2>
          <p className="text-gray-600">{t('dashboard.savingsGoals.subtitle')}</p>
        </div>
        <Button onClick={() => setOpen(true)}>{t('dashboard.savingsGoals.addGoal')}</Button>
      </div>

      <Card className="p-4">
        <h3 className="text-xl font-semibold mb-4">{t('dashboard.savingsGoals.smartSavings.title')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">{t('dashboard.savingsGoals.smartSavings.monthlyIncome')}</p>
            <p className="text-lg font-semibold">${monthlyIncome.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">{t('dashboard.savingsGoals.smartSavings.availableForSavings')}</p>
            <p className="text-lg font-semibold">${availableForSavings.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">{t('dashboard.savingsGoals.smartSavings.recommendedSavings')}</p>
            <p className="text-lg font-semibold">${recommendedSavings.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">{t('dashboard.savingsGoals.smartSavings.savingsRate')}</p>
            <p className="text-lg font-semibold">{savingsPercentage.toFixed(1)}%</p>
          </div>
        </div>
        <Button className="mt-4" onClick={() => {
          const distributed = distributeAutoSavings(recommendedSavings);
          if (distributed > 0) {
            forceUpdate();
          }
        }}>
          {t('dashboard.savingsGoals.smartSavings.autoDistribute')}
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const deadline = new Date(goal.deadline);
          const daysLeft = Math.ceil(
            (deadline.getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          );

          return (
            <Card key={goal.id} className="p-4 relative">
              <div className="flex justify-between items-center mb-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingGoal(goal.id)}
                  className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDeleteGoal(goal.id)}
                  className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{goal.name}</h3>
                <p className="text-gray-600 mt-1">
                  {t('dashboard.savingsGoals.goal.daysLeft', { count: daysLeft })}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">{t('dashboard.savingsGoals.goal.progress', {
                  current: `$${goal.currentAmount.toFixed(2)}`,
                  target: `$${goal.targetAmount.toFixed(2)}`
                })}</p>
                <Progress value={progress} className="mt-2" />
              </div>
              {editingGoal === goal.id && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>{t('dashboard.savingsGoals.dialog.name')}</Label>
                    <Input
                      value={goal.name}
                      onChange={(e) => onUpdateGoal(goal.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('dashboard.savingsGoals.dialog.targetAmount')}</Label>
                    <Input
                      type="number"
                      value={goal.targetAmount}
                      onChange={(e) => onUpdateGoal(goal.id, { targetAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('dashboard.savingsGoals.dialog.deadline')}</Label>
                    <Input
                      type="date"
                      value={goal.deadline.split("T")[0]}
                      onChange={(e) => onUpdateGoal(goal.id, { deadline: new Date(e.target.value).toISOString() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('dashboard.savingsGoals.dialog.color')}</Label>
                    <Input
                      type="color"
                      value={goal.color}
                      onChange={(e) => onUpdateGoal(goal.id, { color: e.target.value })}
                    />
                  </div>
                  <Button onClick={() => setEditingGoal(null)}>{t('dashboard.savingsGoals.goal.saveChanges')}</Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">{t('dashboard.savingsGoals.dialog.title')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.savingsGoals.dialog.title')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t('dashboard.savingsGoals.dialog.name')}</Label>
              <Input
                placeholder={t('dashboard.savingsGoals.dialog.namePlaceholder')}
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboard.savingsGoals.dialog.targetAmount')}</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={newGoalAmount}
                onChange={(e) => setNewGoalAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboard.savingsGoals.dialog.deadline')}</Label>
              <Input
                type="date"
                value={newGoalDeadline}
                onChange={(e) => setNewGoalDeadline(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('dashboard.savingsGoals.dialog.color')}</Label>
              <Input
                type="color"
                value={newGoalColor}
                onChange={(e) => setNewGoalColor(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">{t('dashboard.savingsGoals.dialog.addButton')}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavingsGoals;
