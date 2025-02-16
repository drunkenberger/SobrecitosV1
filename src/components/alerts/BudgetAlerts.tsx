import { useTranslation } from 'react-i18next';

export function BudgetAlerts({ alerts }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="alert alert-warning">
          <h3 className="font-semibold">
            {t(`dashboard.alerts.${alert.type}.title`)}
          </h3>
          <p>
            {t(`dashboard.alerts.${alert.type}.message`, {
              percent: alert.percent,
              category: alert.category,
              goalName: alert.goalName
            })}
          </p>
        </div>
      ))}
    </div>
  );
} 