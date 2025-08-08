import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Progress } from "../ui/progress";
import { 
  DollarSign, 
  CreditCard, 
  Calculator,
  CheckCircle2,
  AlertCircle,
  TrendingDown
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Debt, DebtPayment } from "../../lib/store";

interface DebtPaymentDialogProps {
  debt: Debt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMakePayment: (payment: Omit<DebtPayment, "id" | "date">) => Promise<void>;
  availableBalance?: number;
}

export function DebtPaymentDialog({ 
  debt, 
  open, 
  onOpenChange, 
  onMakePayment,
  availableBalance = 0
}: DebtPaymentDialogProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: "",
    type: "minimum" as "minimum" | "extra" | "payoff",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!debt) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const currentProgress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
  
  const paymentAmount = parseFloat(formData.amount) || 0;
  const newRemainingAmount = Math.max(0, debt.remainingAmount - paymentAmount);
  const newProgress = ((debt.totalAmount - newRemainingAmount) / debt.totalAmount) * 100;

  const monthlyInterest = debt.interestRate ? (debt.remainingAmount * (debt.interestRate / 100 / 12)) : 0;
  const principalPayment = Math.max(0, paymentAmount - monthlyInterest);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = "Valid payment amount is required";
    }

    if (amount > debt.remainingAmount) {
      newErrors.amount = "Payment cannot exceed remaining balance";
    }

    if (amount > availableBalance && availableBalance > 0) {
      newErrors.amount = "Payment exceeds available balance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      await onMakePayment({
        debtId: debt.id,
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description.trim() || undefined,
      });
      
      // Reset form
      setFormData({
        amount: "",
        type: "minimum",
        description: "",
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error("Error making payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    setFormData(prev => ({ ...prev, amount: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: "" }));
    }
  };

  const setQuickAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toFixed(2) }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: "" }));
    }
  };

  const setPayoffAmount = () => {
    setFormData(prev => ({ 
      ...prev, 
      amount: debt.remainingAmount.toFixed(2),
      type: "payoff"
    }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${debt.color}20`, color: debt.color }}
            >
              <CreditCard className="w-5 h-5" />
            </div>
            Make Payment: {debt.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Debt Overview */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{debt.name}</h4>
                <p className="text-sm text-gray-600">{debt.creditor}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(debt.remainingAmount)}</p>
                <p className="text-sm text-gray-600">remaining</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{Math.round(currentProgress)}% paid off</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Minimum Payment</p>
                <p className="font-medium">{formatCurrency(debt.minimumPayment)}</p>
              </div>
              {debt.interestRate && (
                <>
                  <div>
                    <p className="text-gray-600">Interest Rate</p>
                    <p className="font-medium">{debt.interestRate.toFixed(2)}% APR</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Monthly Interest</p>
                    <p className="font-medium text-red-600">{formatCurrency(monthlyInterest)}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Payment Options */}
          <div className="space-y-3">
            <Label>Quick Payment Options</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuickAmount(debt.minimumPayment)}
                className="justify-start h-auto p-3"
              >
                <div className="text-left">
                  <p className="font-medium">Minimum Payment</p>
                  <p className="text-sm text-gray-600">{formatCurrency(debt.minimumPayment)}</p>
                </div>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuickAmount(debt.minimumPayment * 2)}
                className="justify-start h-auto p-3"
              >
                <div className="text-left">
                  <p className="font-medium">Double Payment</p>
                  <p className="text-sm text-gray-600">{formatCurrency(debt.minimumPayment * 2)}</p>
                </div>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={setPayoffAmount}
                className="justify-start h-auto p-3 col-span-2"
              >
                <div className="text-left">
                  <p className="font-medium text-green-700">Pay Off Completely</p>
                  <p className="text-sm text-gray-600">{formatCurrency(debt.remainingAmount)}</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="amount"
                type="text"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className={`pl-9 text-lg font-medium ${errors.amount ? "border-red-500" : ""}`}
              />
            </div>
            {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
            
            {availableBalance > 0 && (
              <p className="text-sm text-gray-600">
                Available balance: {formatCurrency(availableBalance)}
              </p>
            )}
          </div>

          {/* Payment Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Payment Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: "minimum" | "extra" | "payoff") => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimum">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Minimum Payment</span>
                  </div>
                </SelectItem>
                <SelectItem value="extra">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-green-600" />
                    <span>Extra Payment</span>
                  </div>
                </SelectItem>
                <SelectItem value="payoff">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span>Payoff Payment</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Impact Preview */}
          {paymentAmount > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-blue-900 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Payment Impact
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">New Balance</p>
                  <p className="font-medium text-blue-900">
                    {formatCurrency(newRemainingAmount)}
                  </p>
                </div>
                
                <div>
                  <p className="text-blue-700">New Progress</p>
                  <p className="font-medium text-blue-900">
                    {Math.round(newProgress)}% paid off
                  </p>
                </div>

                {debt.interestRate && (
                  <>
                    <div>
                      <p className="text-blue-700">Interest Portion</p>
                      <p className="font-medium text-red-600">
                        {formatCurrency(Math.min(monthlyInterest, paymentAmount))}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-blue-700">Principal Portion</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(principalPayment)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {newRemainingAmount === 0 && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">Debt will be paid off completely!</span>
                  </div>
                </div>
              )}
              
              <Progress value={newProgress} className="h-2" />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add notes about this payment..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.amount}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Make Payment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}