import { useTranslation } from 'react-i18next';
import type { Expense } from '@/lib/store';
import type { Category } from '@/types/category';

interface ExpenseBreakdownProps {
  expenses: Expense[];
  categories: Category[];
}

export function ExpenseBreakdown({ expenses, categories }: ExpenseBreakdownProps) {
  const { t } = useTranslation();

  const categoryTotals = categories.map(category => {
    const total = expenses
      .filter(exp => exp.category === category.name)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      category: category.name,
      total,
      color: category.color
    };
  });

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {t('dashboard.expenseBreakdown.title')}
      </h2>
      <div className="grid gap-4">
        {categoryTotals.map(({ category, total, color }) => (
          <div key={category} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">
                {t(`dashboard.categories.${category.toLowerCase()}`)}
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold">${total.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({Math.round((total / totalSpent) * 100)}% {t('dashboard.expenseBreakdown.ofTotal')})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 