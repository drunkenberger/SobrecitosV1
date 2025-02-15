import { useTranslation } from 'react-i18next';

export function ExpenseBreakdown() {
  const { t } = useTranslation();

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {t('dashboard.expenseBreakdown.title')}
        </h2>
        <select className="select select-sm">
          {Object.entries({
            categorySplit: t('dashboard.expenseBreakdown.tabs.categorySplit'),
            amountByCategory: t('dashboard.expenseBreakdown.tabs.amountByCategory'),
            dailySpending: t('dashboard.expenseBreakdown.tabs.dailySpending'),
            trends: t('dashboard.expenseBreakdown.tabs.trends'),
            insights: t('dashboard.expenseBreakdown.tabs.insights')
          }).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="chart-container">
        {/* Pie chart component */}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {Object.entries({
          groceries: 1.5,
          utilities: 25.3,
          entertainment: 6.1,
          salad: 67.1
        }).map(([category, percent]) => (
          <span key={category}>
            {t(`dashboard.categories.${category}`)} ({percent}%)
          </span>
        ))}
      </div>
    </div>
  );
} 