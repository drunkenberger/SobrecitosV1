import { useTranslation } from 'react-i18next';

export function BudgetAlerts() {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="alert alert-warning">
        <h4>{t('dashboard.alerts.utilities.title')}</h4>
        <p>{t('dashboard.alerts.utilities.message', { percent: 84 })}</p>
      </div>
      <div className="alert alert-error">
        <h4>{t('dashboard.alerts.salad.title')}</h4>
        <p>{t('dashboard.alerts.salad.message', { percent: 171 })}</p>
      </div>
    </div>
  );
} 