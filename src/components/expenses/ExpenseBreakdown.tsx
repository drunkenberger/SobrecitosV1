import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExpenseChart } from '@/components/charts/ExpenseChart';

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  budget: number;
  color: string;
}

interface ExpenseBreakdownProps {
  expenses: Expense[];
  categories: Category[];
}

export function ExpenseBreakdown({ expenses, categories }: ExpenseBreakdownProps) {
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