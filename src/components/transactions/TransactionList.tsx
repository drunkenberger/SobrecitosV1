import { useTranslation } from 'react-i18next';

export function TransactionList({ transactions, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {t('dashboard.transactions.title')}
      </h2>
      {transactions.length === 0 ? (
        <p className="text-muted-foreground">
          {t('dashboard.transactions.noTransactions')}
        </p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th>{t('dashboard.transactions.table.date')}</th>
              <th>{t('dashboard.transactions.table.description')}</th>
              <th>{t('dashboard.transactions.table.category')}</th>
              <th>{t('dashboard.transactions.table.amount')}</th>
              <th>{t('dashboard.transactions.table.actions')}</th>
            </tr>
          </thead>
          {/* ... table body ... */}
        </table>
      )}
    </div>
  );
} 