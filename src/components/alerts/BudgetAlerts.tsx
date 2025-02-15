import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Alert {
  type: 'category' | 'overall';
  percentage: number;
  severity: 'warning' | 'error' | 'info';
  category?: string;
}

interface BudgetAlertsProps {
  alerts: Alert[];
}

export function BudgetAlerts({ alerts }: BudgetAlertsProps) {
  const { t } = useTranslation();

  const getCategoryTranslationKey = (category: string) => {
    return `dashboard.categories.${category.toLowerCase()}`;
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Alert 
          key={`${alert.type}-${alert.category || 'overall'}`}
          variant={alert.severity === 'error' ? 'destructive' : 'default'}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {t(`dashboard.alerts.${alert.type}.title`, {
              category: alert.category ? t(getCategoryTranslationKey(alert.category)) : null
            })}
          </AlertTitle>
          <AlertDescription>
            {t(`dashboard.alerts.${alert.type}.message`, {
              percent: alert.percentage
            })}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
} 