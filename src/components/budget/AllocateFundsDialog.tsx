import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PiggyBank, Plus, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

interface AllocateFundsDialogProps {
  goals: SavingsGoal[];
  availableBalance: number;
  onAllocateFunds: (goalId: string, amount: number) => Promise<void>;
  trigger?: React.ReactNode;
}

export function AllocateFundsDialog({
  goals,
  availableBalance,
  onAllocateFunds,
  trigger,
}: AllocateFundsDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);
  const remainingAmount = selectedGoal 
    ? selectedGoal.targetAmount - selectedGoal.currentAmount 
    : 0;
  
  const maxAllocation = Math.min(availableBalance, remainingAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !amount || Number(amount) <= 0) return;

    const allocationAmount = Number(amount);
    if (allocationAmount > maxAllocation) return;

    try {
      setIsSubmitting(true);
      await onAllocateFunds(selectedGoalId, allocationAmount);
      
      // Reset form
      setSelectedGoalId("");
      setAmount("");
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaxAllocation = () => {
    setAmount(maxAllocation.toString());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            <PiggyBank className="w-4 h-4" />
            Allocate to Savings
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-green-600" />
            Allocate Funds to Savings Goal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Available Balance Display */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Available Balance</p>
                <p className="text-2xl font-bold text-green-800">
                  ${availableBalance.toLocaleString()}
                </p>
              </div>
              <PiggyBank className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No savings goals available.</p>
              <p className="text-sm text-gray-400">Create a savings goal first to allocate funds.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Goal Selection */}
              <div className="space-y-2">
                <Label htmlFor="goal">Select Savings Goal</Label>
                <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a savings goal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      const remaining = goal.targetAmount - goal.currentAmount;
                      
                      return (
                        <SelectItem key={goal.id} value={goal.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{goal.name}</span>
                            <span className="text-xs text-gray-500">
                              ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()} 
                              ({Math.round(progress)}%) • ${remaining.toLocaleString()} remaining
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Goal Details */}
              {selectedGoal && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-900">{selectedGoal.name}</h4>
                    <span className="text-sm text-blue-700">
                      ${remainingAmount.toLocaleString()} needed
                    </span>
                  </div>
                  <Progress 
                    value={(selectedGoal.currentAmount / selectedGoal.targetAmount) * 100} 
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-blue-600">
                    <span>${selectedGoal.currentAmount.toLocaleString()}</span>
                    <span>${selectedGoal.targetAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Amount to Allocate</Label>
                  {selectedGoal && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleMaxAllocation}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Max: ${maxAllocation.toLocaleString()}
                    </Button>
                  )}
                </div>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  max={maxAllocation}
                  step="0.01"
                  required
                  disabled={!selectedGoalId}
                />
                {selectedGoal && Number(amount) > maxAllocation && (
                  <p className="text-sm text-red-600">
                    Amount cannot exceed ${maxAllocation.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Allocation Preview */}
              {selectedGoal && amount && Number(amount) > 0 && Number(amount) <= maxAllocation && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <span>${availableBalance.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      ${(availableBalance - Number(amount)).toLocaleString()}
                    </span>
                    <span className="text-gray-500">(remaining balance)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span>{selectedGoal.name}:</span>
                    <span>${selectedGoal.currentAmount.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-green-600">
                      ${(selectedGoal.currentAmount + Number(amount)).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={
                  isSubmitting || 
                  !selectedGoalId || 
                  !amount || 
                  Number(amount) <= 0 || 
                  Number(amount) > maxAllocation
                }
              >
                {isSubmitting ? (
                  "Allocating..."
                ) : (
                  <>
                    <PiggyBank className="w-4 h-4 mr-2" />
                    Allocate ${amount || "0"} to Savings
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}