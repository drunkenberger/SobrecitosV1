import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExpenseChart } from '@/components/charts/ExpenseChart';

interface ExpenseBreakdownProps {
  expenses: {
    amount: number;
    category: string;
    date: Date;
  }[];
}

export function ExpenseBreakdown({ expenses }: ExpenseBreakdownProps) {
  const { t } = useTranslation();

  const categoryTotals = {
    groceries: expenses.filter(exp => exp.category === 'groceries').reduce((sum, exp) => sum + exp.amount, 0),
    utilities: expenses.filter(exp => exp.category === 'utilities').reduce((sum, exp) => sum + exp.amount, 0),
    entertainment: expenses.filter(exp => exp.category === 'entertainment').reduce((sum, exp) => sum + exp.amount, 0),
    salad: expenses.filter(exp => exp.category === 'salad').reduce((sum, exp) => sum + exp.amount, 0)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.expenseBreakdown.title')}</CardTitle>
        <CardDescription>{t('dashboard.expenseBreakdown.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ExpenseChart data={categoryTotals} />
      </CardContent>
    </Card>
  );
} 