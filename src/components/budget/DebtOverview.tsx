import React from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  CreditCard, 
  DollarSign, 
  TrendingDown,
  AlertTriangle,
  Clock,
  Target,
  Calculator
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Debt } from "../../lib/store";

interface DebtOverviewProps {
  debts: Debt[];
  debtStatistics: {
    totalDebt: number;
    totalMinimumPayments: number;
    totalInterest: number;
    debtToIncomeRatio: number;
    payoffProjections: { debtId: string; monthsToPayoff: number; totalInterest: number }[];
  };
}

export default function DebtOverview({ debts, debtStatistics }: DebtOverviewProps) {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonths = (months: number) => {
    if (months <= 0) return "N/A";
    if (months === -1) return "Never*";
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${months}mo`;
    } else if (remainingMonths === 0) {
      return `${years}yr`;
    } else {
      return `${years}yr ${remainingMonths}mo`;
    }
  };

  const getDebtRiskLevel = (debtToIncomeRatio: number) => {
    if (debtToIncomeRatio <= 20) {
      return { level: "Low", color: "text-green-600", bgColor: "bg-green-100" };
    } else if (debtToIncomeRatio <= 36) {
      return { level: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    } else {
      return { level: "High", color: "text-red-600", bgColor: "bg-red-100" };
    }
  };

  const totalOriginalDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
  const totalPaidOff = totalOriginalDebt - debtStatistics.totalDebt;
  const overallProgress = totalOriginalDebt > 0 ? (totalPaidOff / totalOriginalDebt) * 100 : 0;
  
  const riskLevel = getDebtRiskLevel(debtStatistics.debtToIncomeRatio);
  
  // Find debts with highest priority (shortest payoff time or highest interest)
  const priorityDebt = debts
    .map(debt => {
      const projection = debtStatistics.payoffProjections.find(p => p.debtId === debt.id);
      return {
        ...debt,
        payoffMonths: projection?.monthsToPayoff || -1,
        totalInterest: projection?.totalInterest || 0
      };
    })
    .filter(debt => debt.remainingAmount > 0)
    .sort((a, b) => {
      // Sort by payoff time first, then by interest rate
      if (a.payoffMonths !== b.payoffMonths) {
        if (a.payoffMonths === -1) return 1;
        if (b.payoffMonths === -1) return -1;
        return a.payoffMonths - b.payoffMonths;
      }
      return (b.interestRate || 0) - (a.interestRate || 0);
    })[0];

  if (debts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Target className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-medium text-gray-900 mb-2">Debt-Free!</h3>
        <p className="text-sm">You currently have no debts tracked. Great job!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Debt */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-red-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <Badge 
              variant="secondary"
              className={`text-xs ${riskLevel.bgColor} ${riskLevel.color} border-0`}
            >
              {riskLevel.level} Risk
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Debt</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(debtStatistics.totalDebt)}
            </p>
          </div>
        </Card>

        {/* Monthly Payments */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-orange-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <Badge variant="outline" className="text-xs">
              {debtStatistics.debtToIncomeRatio.toFixed(1)}% DTI
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Monthly Payments</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(debtStatistics.totalMinimumPayments)}
            </p>
          </div>
        </Card>

        {/* Monthly Interest */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-yellow-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-yellow-600" />
            </div>
            <Badge variant="outline" className="text-xs text-red-600">
              Interest
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Monthly Interest</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(debtStatistics.totalInterest)}
            </p>
          </div>
        </Card>

        {/* Overall Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <Badge 
              variant="secondary"
              className="text-xs bg-green-100 text-green-700 border-0"
            >
              {Math.round(overallProgress)}%
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Paid Off</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaidOff)}
            </p>
          </div>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <div className="text-sm text-gray-600">
            {formatCurrency(totalPaidOff)} of {formatCurrency(totalOriginalDebt)} paid off
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={overallProgress} className="h-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Started: {formatCurrency(totalOriginalDebt)}</span>
            <span>Remaining: {formatCurrency(debtStatistics.totalDebt)}</span>
          </div>
        </div>
      </Card>

      {/* Priority Debt Alert */}
      {priorityDebt && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-orange-800 mb-1">Priority Debt</h4>
              <p className="text-sm text-orange-700 mb-2">
                Focus on <span className="font-medium">{priorityDebt.name}</span> - 
                {priorityDebt.payoffMonths > 0 && (
                  <span> payoff in {formatMonths(priorityDebt.payoffMonths)}</span>
                )}
                {priorityDebt.interestRate && (
                  <span> at {priorityDebt.interestRate.toFixed(2)}% APR</span>
                )}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span>Balance: {formatCurrency(priorityDebt.remainingAmount)}</span>
                <span>Min Payment: {formatCurrency(priorityDebt.minimumPayment)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Payoff Projections */}
      {debtStatistics.payoffProjections.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Payoff Timeline</h3>
            <Badge variant="outline" className="text-xs">
              Minimum payments only
            </Badge>
          </div>
          
          <div className="space-y-3">
            {debtStatistics.payoffProjections
              .filter(projection => {
                const debt = debts.find(d => d.id === projection.debtId);
                return debt && debt.remainingAmount > 0;
              })
              .sort((a, b) => {
                if (a.monthsToPayoff === -1 && b.monthsToPayoff === -1) return 0;
                if (a.monthsToPayoff === -1) return 1;
                if (b.monthsToPayoff === -1) return -1;
                return a.monthsToPayoff - b.monthsToPayoff;
              })
              .map((projection) => {
                const debt = debts.find(d => d.id === projection.debtId);
                if (!debt) return null;
                
                return (
                  <div key={debt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: debt.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{debt.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(debt.remainingAmount)} remaining
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {formatMonths(projection.monthsToPayoff)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {projection.totalInterest > 0 && projection.totalInterest !== -1 && (
                          <>+{formatCurrency(projection.totalInterest)} interest</>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
          
          {debtStatistics.payoffProjections.some(p => p.monthsToPayoff === -1) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>* Never:</strong> Some debts have minimum payments that don't cover the interest, 
                meaning they will never be paid off with minimum payments alone.
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}