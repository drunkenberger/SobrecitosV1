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

interface SavingsGoalsProps {
  goals?: SavingsGoal[];
  onAddGoal?: (goal: Omit<SavingsGoal, "id">) => void;
  onUpdateGoal?: (id: string, updates: Partial<SavingsGoal>) => void;
  onDeleteGoal?: (id: string) => void;
}

const SavingsGoals = ({
  goals = [],
  onAddGoal = () => {},
  onUpdateGoal = () => {},
  onDeleteGoal = () => {},
}: SavingsGoalsProps) => {
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
    <Card className="w-full bg-white p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className="w-6 h-6" /> Savings Goals
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track your progress towards financial goals
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold">
                <Plus size={16} /> Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Savings Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Goal Name</Label>
                  <Input
                    placeholder="e.g., Emergency Fund"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Amount ($)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newGoalAmount}
                    onChange={(e) => setNewGoalAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={newGoalDeadline}
                    onChange={(e) => setNewGoalDeadline(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={newGoalColor}
                    onChange={(e) => setNewGoalColor(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> Smart Savings
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="text-blue-600"
              onClick={() => {
                const distributed = distributeAutoSavings(recommendedSavings);
                if (distributed > 0) {
                  forceUpdate();
                }
              }}
            >
              Auto-Distribute Savings
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Recommended Monthly Savings</p>
              <p className="font-semibold">${recommendedSavings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Available for Savings</p>
              <p className="font-semibold">${availableForSavings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Monthly Income</p>
              <p className="font-semibold">${totalIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Savings Rate</p>
              <p className="font-semibold">{savingsPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const deadline = new Date(goal.deadline);
              const daysLeft = Math.ceil(
                (deadline.getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {daysLeft} days left
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingGoal(goal.id)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteGoal(goal.id)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        ${goal.currentAmount.toLocaleString()} of $
                        {goal.targetAmount.toLocaleString()}
                      </span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2"
                      indicatorClassName={
                        progress >= 100 ? "bg-green-500" : undefined
                      }
                      style={{ backgroundColor: `${goal.color}20` }}
                      indicatorStyle={{ backgroundColor: goal.color }}
                    />
                  </div>

                  {editingGoal === goal.id && (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex gap-3">
                        <Input
                          type="number"
                          value={goal.currentAmount}
                          onChange={(e) =>
                            onUpdateGoal(goal.id, {
                              currentAmount: Number(e.target.value),
                            })
                          }
                          placeholder="Current amount"
                        />
                        <Input
                          type="number"
                          value={goal.targetAmount}
                          onChange={(e) =>
                            onUpdateGoal(goal.id, {
                              targetAmount: Number(e.target.value),
                            })
                          }
                          placeholder="Target amount"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Input
                          type="date"
                          value={goal.deadline.split("T")[0]}
                          onChange={(e) =>
                            onUpdateGoal(goal.id, {
                              deadline: new Date(e.target.value).toISOString(),
                            })
                          }
                        />
                        <Button
                          onClick={() => setEditingGoal(null)}
                          className="flex items-center gap-2"
                        >
                          <Save size={16} /> Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default SavingsGoals;
