import { useTranslation } from 'react-i18next';

export function ExpenseBreakdown({ expenses, categories }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {t('dashboard.expenseBreakdown.title')}
        </h2>
        <select className="select select-sm">
          <option value="pie">{t('dashboard.expenseBreakdown.viewOptions.pie')}</option>
          <option value="bar">{t('dashboard.expenseBreakdown.viewOptions.bar')}</option>
          <option value="line">{t('dashboard.expenseBreakdown.viewOptions.line')}</option>
        </select>
      </div>
      {/* ... chart components ... */}
    </div>
  );
} 