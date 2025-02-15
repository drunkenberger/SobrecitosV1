import { useTranslation } from 'react-i18next';

export function RecentTransactions() {
  const { t } = useTranslation();

  return (
    <div className="recent-transactions">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {t('dashboard.transactions.recentExpenses')}
        </h2>
        <button className="btn btn-warning">
          {t('dashboard.transactions.addExpense')}
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <input 
            type="search" 
            placeholder={t('dashboard.transactions.searchPlaceholder')}
            className="input input-sm"
          />
          <select className="select select-sm">
            <option>{t('dashboard.transactions.allCategories')}</option>
          </select>
        </div>
        <button className="btn btn-ghost btn-sm">
          {t('dashboard.transactions.sortByDate')}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-white rounded">
          <div>
            <p className="font-medium">{t('dashboard.transactions.expenses.cinema')}</p>
            <span className="text-sm text-gray-500">
              {t('dashboard.transactions.daysAgo', { count: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-purple">
              {t('dashboard.transactions.categories.entertainment')}
            </span>
            <span className="font-medium">$500.00</span>
          </div>
        </div>

        <div className="flex justify-between items-center p-2 bg-white rounded">
          <div>
            <p className="font-medium">{t('dashboard.transactions.expenses.operation')}</p>
            <span className="text-sm text-gray-500">
              {t('dashboard.transactions.daysAgo', { count: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-yellow">
              {t('dashboard.transactions.categories.medical')}
            </span>
            <span className="font-medium">$22032.00</span>
          </div>
        </div>

        {/* Continue with other transactions using the same pattern */}
      </div>
    </div>
  );
} 