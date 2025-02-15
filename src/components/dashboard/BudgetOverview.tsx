import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface BudgetOverviewProps {
  totalBudget: number;
  spentAmount: number;
  remainingBalance: number;
}

export function BudgetOverview({ totalBudget, spentAmount, remainingBalance }: BudgetOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.overview.totalBudget')}</CardTitle>
          <CardDescription>${totalBudget.toLocaleString()}</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.overview.spentAmount')}</CardTitle>
          <CardDescription>${spentAmount.toLocaleString()}</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.overview.remainingBalance')}</CardTitle>
          <CardDescription>${remainingBalance.toLocaleString()}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
} 