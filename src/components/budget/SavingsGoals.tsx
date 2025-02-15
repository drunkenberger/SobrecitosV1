import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { X, Edit2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, "id">) => void;
  onUpdateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  onDeleteGoal: (id: string) => void;
  monthlyIncome: number;
}

export default function SavingsGoals({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}: SavingsGoalsProps) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [newGoal, setNewGoal] = React.useState({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    color: "#4CAF50",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) return;

    onAddGoal({
      name: newGoal.name,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: 0,
      deadline: new Date(newGoal.deadline).toISOString(),
      color: newGoal.color,
    });

    setNewGoal({
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: "",
      color: "#4CAF50",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('dashboard.savingsGoals.title')}</h2>
          <p className="text-gray-600">{t('dashboard.savingsGoals.subtitle')}</p>
        </div>
        <Button onClick={() => setEditingId(null)}>{t('dashboard.savingsGoals.addGoal')}</Button>
      </div>

      <div className="grid gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          const deadline = new Date(goal.deadline);
          const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <Card key={goal.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{goal.name}</h3>
                  <p className="text-sm text-gray-500">
                    {t('dashboard.savingsGoals.goal.deadline', { date: deadline.toLocaleDateString() })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingId(goal.id)}
                    className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteGoal(goal.id)}
                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="mt-2" />
              </div>

              {editingId === goal.id && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>{t('dashboard.savingsGoals.goal.currentAmount')}</Label>
                    <Input
                      type="number"
                      value={goal.currentAmount}
                      onChange={(e) =>
                        onUpdateGoal(goal.id, {
                          currentAmount: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <Button onClick={() => setEditingId(null)}>
                    {t('dashboard.savingsGoals.goal.saveChanges')}
                  </Button>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">{t('dashboard.savingsGoals.goal.remaining')}</span>
                  <p className="font-medium">${remaining.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('dashboard.savingsGoals.goal.timeLeft')}</span>
                  <p className="font-medium">
                    {daysLeft} {t('dashboard.savingsGoals.goal.days')}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>{t('dashboard.savingsGoals.dialog.name')}</Label>
          <Input
            placeholder={t('dashboard.savingsGoals.dialog.namePlaceholder')}
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>{t('dashboard.savingsGoals.dialog.targetAmount')}</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={newGoal.targetAmount}
            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>{t('dashboard.savingsGoals.dialog.deadline')}</Label>
          <Input
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>{t('dashboard.savingsGoals.dialog.color')}</Label>
          <Input
            type="color"
            value={newGoal.color}
            onChange={(e) => setNewGoal({ ...newGoal, color: e.target.value })}
          />
        </div>
        <Button type="submit" className="w-full">
          {t('dashboard.savingsGoals.dialog.addButton')}
        </Button>
      </form>
    </div>
  );
}
