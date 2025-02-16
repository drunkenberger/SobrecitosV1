import { useTranslation } from 'react-i18next';
import type { Expense } from '@/lib/store';

interface TransactionListProps {
  transactions: Expense[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
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
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div>
                <h3 className="font-medium">{transaction.description}</h3>
                <p className="text-sm text-gray-500">
                  {t(`dashboard.categories.${transaction.category.toLowerCase()}`)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  ${transaction.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 