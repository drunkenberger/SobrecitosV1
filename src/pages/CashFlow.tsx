import React from 'react';
import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import FuturePayments from '@/components/budget/FuturePayments';
import BudgetManager from '@/components/budget/BudgetManager';

export default function CashFlow() {
  const { t } = useTranslation();
  const { 
    monthlyBudget,
    additionalIncomes,
    expenses,
    futurePayments,
    categories,
    updateMonthlyBudget,
    addIncome,
    deleteIncome,
    addFuturePayment,
    updateFuturePayment
  } = useStore();

  // Calculate metrics
  const totalBudget = (monthlyBudget || 0) + 
    (additionalIncomes || []).reduce((sum, inc) => sum + (inc?.amount || 0), 0);
  const spentAmount = (expenses || []).reduce((sum, exp) => sum + (exp?.amount || 0), 0);
  const remainingBalance = totalBudget - spentAmount;
  
  // Calculate upcoming payments
  const upcomingTotal = (futurePayments || [])
    .filter(payment => !payment.isPaid)
    .reduce((sum, payment) => sum + payment.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('navigation.cashFlow')}
          </h1>
          <p className="text-gray-600">
            Monitor your income and expenses flow
          </p>
        </div>
      </div>

      {/* Cash Flow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Monthly
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              Spent
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(spentAmount)}</p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              remainingBalance >= 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {remainingBalance >= 0 ? 'Available' : 'Over budget'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Net Cash Flow</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(remainingBalance)}</p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              Upcoming
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Future Payments</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(upcomingTotal)}</p>
          </div>
        </Card>
      </div>

      {/* Cash Flow Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Management */}
        <Card className="bg-white shadow-lg border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-green-100 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Income Sources</h3>
                <p className="text-sm text-gray-600">Manage your income streams</p>
              </div>
            </div>
            <div className="space-y-4">
              <BudgetManager
                monthlyBudget={monthlyBudget}
                additionalIncomes={additionalIncomes}
                onUpdateMonthlyBudget={updateMonthlyBudget}
                onAddIncome={addIncome}
                onDeleteIncome={deleteIncome}
              />
            </div>
          </div>
        </Card>

        {/* Future Payments */}
        <Card className="bg-white shadow-lg border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Future Payments</h3>
                <p className="text-sm text-gray-600">Upcoming bills and payments</p>
              </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              <FuturePayments
                payments={futurePayments || []}
                categories={categories || []}
                onAddPayment={addFuturePayment}
                onUpdatePayment={updateFuturePayment}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}