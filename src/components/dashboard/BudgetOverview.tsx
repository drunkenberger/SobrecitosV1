import { useTranslation } from 'react-i18next';

interface BudgetOverviewProps {
  totalBudget: number;
  spentAmount: number;
  remainingBalance: number;
}

export function BudgetOverview({ totalBudget, spentAmount, remainingBalance }: BudgetOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">
          {t('dashboard.overview.totalBudget')}
        </h3>
        <p className="text-3xl font-bold text-gray-700 mt-2">
          ${totalBudget.toLocaleString()}
        </p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">
          {t('dashboard.overview.spentAmount')}
        </h3>
        <p className="text-3xl font-bold text-gray-700 mt-2">
          ${spentAmount.toLocaleString()}
        </p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">
          {t('dashboard.overview.remainingBalance')}
        </h3>
        <p className="text-3xl font-bold text-gray-700 mt-2">
          ${remainingBalance.toLocaleString()}
        </p>
      </div>
    </div>
  );
} 