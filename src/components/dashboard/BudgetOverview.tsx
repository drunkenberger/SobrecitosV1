import { useTranslation } from 'react-i18next';

export function BudgetOverview({ totalBudget, spentAmount, remainingBalance }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card bg-green-50 p-4">
        <h3>{t('dashboard.overview.totalBudget')}</h3>
        <p className="text-2xl font-bold">${totalBudget}</p>
      </div>
      <div className="card bg-red-50 p-4">
        <h3>{t('dashboard.overview.spentAmount')}</h3>
        <p className="text-2xl font-bold">${spentAmount}</p>
      </div>
      <div className="card bg-blue-50 p-4">
        <h3>{t('dashboard.overview.remainingBalance')}</h3>
        <p className="text-2xl font-bold">${remainingBalance}</p>
      </div>
    </div>
  );
} 