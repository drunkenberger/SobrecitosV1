import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { X, Edit2, Target, Plus } from "lucide-react";
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
  onAddGoal: (goal: Omit<SavingsGoal, "id">) => Promise<void>;
  onUpdateGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
}

export default function SavingsGoals({
  goals = [],
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}: SavingsGoalsProps) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = React.useState<string | null | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newGoal, setNewGoal] = React.useState({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    color: "#4CAF50",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) return;

    try {
      setIsSubmitting(true);
      await onAddGoal({
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {goals.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Your Goals</h3>
            <p className="text-sm text-gray-600">Track progress towards your financial targets</p>
          </div>
          <Button 
            onClick={() => setEditingId(null)}
            size="sm"
            variant="outline"
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Goal
          </Button>
        </div>
      )}

      <div className="grid gap-6">
        {goals.filter(goal => goal && goal.id).map((goal) => {
          const progress = goal.targetAmount > 0 ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const deadline = new Date(goal.deadline);
          const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

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
        
        {goals.length === 0 && !editingId && (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No savings goals yet</h3>
            <p className="text-sm text-gray-600 mb-4">Start building your financial future by setting your first savings goal</p>
            <Button 
              onClick={() => setEditingId(null)} 
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create First Goal
            </Button>
          </div>
        )}
      </div>

      {editingId !== undefined && (
        <div className="border-t pt-6 mt-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId === null ? "Create New Goal" : "Edit Goal"}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input
                  placeholder="e.g., Emergency Fund"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Target Amount ($)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input
                  type="color"
                  value={newGoal.color}
                  onChange={(e) => setNewGoal({ ...newGoal, color: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (editingId === null ? "Create Goal" : "Update Goal")}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingId(undefined)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
