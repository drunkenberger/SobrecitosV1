import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  Trash2,
  Edit2,
  Plus,
  TrendingDown,
  AlertTriangle,
  Clock
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import type { Debt, DebtPayment } from "../../lib/store";
import { AddDebtDialog } from "./AddDebtDialog";

interface DebtManagerProps {
  debts: Debt[];
  onAddDebt: (debt: Omit<Debt, "id" | "createdDate">) => Promise<void>;
  onUpdateDebt: (id: string, updates: Partial<Debt>) => Promise<void>;
  onDeleteDebt: (id: string) => Promise<void>;
  onMakePayment: (payment: Omit<DebtPayment, "id" | "date">) => Promise<void>;
  onPaymentClick?: (debt: Debt) => void;
}

export default function DebtManager({
  debts = [],
  onAddDebt,
  onUpdateDebt,
  onDeleteDebt,
  onMakePayment,
  onPaymentClick,
}: DebtManagerProps) {
  const { t } = useTranslation();

  const getDebtTypeIcon = (type: string) => {
    switch (type) {
      case "credit_card":
        return <CreditCard className="w-4 h-4" />;
      case "mortgage":
        return <Calendar className="w-4 h-4" />;
      case "loan":
      case "student_loan":
      case "personal":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <TrendingDown className="w-4 h-4" />;
    }
  };

  const getDebtTypeLabel = (type: string) => {
    const labels = {
      credit_card: "Credit Card",
      loan: "Loan",
      mortgage: "Mortgage",
      student_loan: "Student Loan",
      personal: "Personal",
      other: "Other"
    };
    return labels[type] || "Other";
  };

  const getDebtStatusColor = (debt: Debt) => {
    const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
    const dueDate = new Date(debt.dueDate);
    const now = new Date();
    const daysDifference = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (progress >= 100) return "bg-green-100 text-green-700 border-green-200";
    if (daysDifference < 7) return "bg-red-100 text-red-700 border-red-200";
    if (daysDifference < 30) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getDebtUrgency = (debt: Debt) => {
    const dueDate = new Date(debt.dueDate);
    const now = new Date();
    const daysDifference = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

    if (daysDifference < 7) return { label: "Due Soon", priority: 1 };
    if (daysDifference < 30) return { label: "Due This Month", priority: 2 };
    return { label: "Upcoming", priority: 3 };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const sortedDebts = [...debts].sort((a, b) => {
    const urgencyA = getDebtUrgency(a);
    const urgencyB = getDebtUrgency(b);
    if (urgencyA.priority !== urgencyB.priority) {
      return urgencyA.priority - urgencyB.priority;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-600">Debt Management</h3>
            <Badge variant="secondary" className="text-xs">
              {debts.length} {debts.length === 1 ? 'debt' : 'debts'}
            </Badge>
          </div>
        </div>
        
        <AddDebtDialog
          onAddDebt={onAddDebt}
          trigger={
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Debt
            </Button>
          }
        />
      </div>

      {/* Debt List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3">
            {debts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No debts tracked</h3>
                <p className="text-sm">Add your debts to track payments and payoff progress</p>
              </div>
            ) : (
              sortedDebts.map((debt) => {
                const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100;
                const urgency = getDebtUrgency(debt);
                const statusColor = getDebtStatusColor(debt);
                
                return (
                  <div
                    key={debt.id}
                    className="group p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2.5 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${debt.color}20`, color: debt.color }}
                        >
                          {getDebtTypeIcon(debt.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {debt.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${statusColor} whitespace-nowrap`}
                            >
                              {urgency.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="truncate">{debt.creditor}</span>
                            <Badge variant="outline" className="text-xs">
                              {getDebtTypeLabel(debt.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPaymentClick?.(debt)}
                          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                        >
                          <DollarSign className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteDebt(debt.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Debt Details */}
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">
                            {Math.round(progress)}% paid off
                          </span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-2 [&>div]:transition-all"
                          style={{
                            // @ts-ignore - CSS custom property for progress bar color
                            '--progress-background': debt.color,
                          } as React.CSSProperties}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Paid: {formatCurrency(debt.totalAmount - debt.remainingAmount)}</span>
                          <span>Remaining: {formatCurrency(debt.remainingAmount)}</span>
                        </div>
                      </div>

                      {/* Financial Details */}
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <DollarSign className="w-3 h-3" />
                            <span>Minimum Payment</span>
                          </div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(debt.minimumPayment)}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Next Due</span>
                          </div>
                          <p className="font-medium text-gray-900">
                            {format(new Date(debt.dueDate), 'MMM dd')}
                          </p>
                        </div>

                        {debt.interestRate && debt.interestRate > 0 && (
                          <>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <TrendingDown className="w-3 h-3" />
                                <span>Interest Rate</span>
                              </div>
                              <p className="font-medium text-gray-900">
                                {debt.interestRate.toFixed(2)}%
                              </p>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Monthly Interest</span>
                              </div>
                              <p className="font-medium text-red-600">
                                {formatCurrency(debt.remainingAmount * (debt.interestRate / 100 / 12))}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => onPaymentClick?.(debt)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <DollarSign className="w-3 h-3 mr-1" />
                          Make Payment
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPaymentClick?.(debt)}
                          className="px-3"
                        >
                          <Clock className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}