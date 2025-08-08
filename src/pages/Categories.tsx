import React from 'react';
import { Card } from '@/components/ui/card';
import CategoryManager from '@/components/budget/CategoryManager';
import { TransferBalanceDialog } from '@/components/budget/TransferBalanceDialog';
import { useStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function Categories() {
  const { t } = useTranslation();
  const { 
    categories,
    expenses,
    addCategory,
    updateCategory,
    deleteCategory
  } = useStore();

  // Calculate category usage statistics
  const categoryStats = (categories || []).map(category => {
    const categoryExpenses = (expenses || []).filter(expense => 
      expense.category === category.name
    );
    const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const transactionCount = categoryExpenses.length;
    const progress = category.budget > 0 ? (spent / category.budget) * 100 : 0;
    
    return {
      ...category,
      spent,
      remaining: Math.max(0, category.budget - spent),
      progress: Math.min(100, progress),
      transactionCount
    };
  }).sort((a, b) => b.spent - a.spent);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const totalBudget = categoryStats.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categoryStats.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-100 rounded-lg">
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('navigation.categories')}
          </h1>
          <p className="text-gray-600">
            {t('dashboard.categoryManagement.title')}
          </p>
        </div>
      </div>

      {/* Category Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              Spent
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
          </div>
        </Card>

        <Card className="bg-white p-6 border-gray-200 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              totalRemaining >= 0 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {totalRemaining >= 0 ? 'Available' : 'Over budget'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Remaining</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRemaining)}</p>
          </div>
        </Card>
      </div>

      {/* Category Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Manager */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-lg border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Category Management</h3>
                    <p className="text-sm text-gray-600">Organize and track your spending categories</p>
                  </div>
                </div>
                <TransferBalanceDialog categories={categories || []} />
              </div>
              <div className="space-y-4">
                <CategoryManager
                  categories={categories}
                  onAddCategory={addCategory}
                  onUpdateCategory={updateCategory}
                  onDeleteCategory={deleteCategory}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Category Statistics */}
        <div>
          <Card className="bg-white shadow-lg border-gray-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2.5 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
                  <p className="text-sm text-gray-600">By spending amount</p>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {categoryStats.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No categories created yet</p>
                    <p className="text-xs">Add categories to organize your expenses</p>
                  </div>
                ) : (
                  categoryStats.slice(0, 10).map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {category.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(category.spent)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {category.transactionCount} transactions
                          </p>
                        </div>
                      </div>
                      {category.budget > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Budget: {formatCurrency(category.budget)}</span>
                            <span>{Math.round(category.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all ${
                                category.progress > 90 ? 'bg-red-500' : 
                                category.progress > 75 ? 'bg-yellow-500' : 
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(100, category.progress)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}