import { useTranslation } from 'react-i18next';

export function BudgetSettings({ 
  monthlyIncome, 
  categories,
  onUpdateIncome,
  onAddCategory 
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">
          {t('dashboard.budgetSettings.title')}
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-medium">
              {t('dashboard.budgetSettings.monthlyIncome.title')}
            </h3>
            {/* Income settings */}
          </div>
          <div>
            <h3 className="text-lg font-medium">
              {t('dashboard.budgetSettings.categories.title')}
            </h3>
            {/* Category settings */}
          </div>
        </div>
      </div>
    </div>
  );
} 