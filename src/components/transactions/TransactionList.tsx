import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
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
        <table className="w-full">
          <thead>
            <tr>
              <th>{t('dashboard.transactions.table.date')}</th>
              <th>{t('dashboard.transactions.table.description')}</th>
              <th>{t('dashboard.transactions.table.category')}</th>
              <th>{t('dashboard.transactions.table.amount')}</th>
              {onDelete && <th>{t('dashboard.transactions.table.actions')}</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>${transaction.amount.toLocaleString()}</td>
                {onDelete && (
                  <td>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 