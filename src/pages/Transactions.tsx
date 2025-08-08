import React from 'react';
import { Card } from '@/components/ui/card';
import ExpenseList from '@/components/budget/ExpenseList';
import { useStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import { Receipt } from 'lucide-react';

export default function Transactions() {
  const { t } = useTranslation();
  const { expenses, categories, deleteExpense } = useStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Receipt className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('navigation.transactions')}
          </h1>
          <p className="text-gray-600">
            {t('dashboard.transactions.title')}
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <Card className="bg-white shadow-lg border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <Receipt className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('dashboard.transactions.recentExpenses')}
              </h3>
              <p className="text-sm text-gray-600">
                Your complete transaction history
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <ExpenseList
              expenses={expenses || []}
              categories={categories || []}
              onDeleteExpense={deleteExpense}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}