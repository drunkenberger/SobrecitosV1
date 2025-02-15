import { useTranslation } from 'react-i18next';

export function DashboardHeader() {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img src="/src/assets/icons/logo.svg" alt="Sobrecitos" className="h-12 w-12" />
        <div>
          <h1 className="text-xl font-bold text-white">{t('dashboard.header.title')}</h1>
          <p className="text-white/80">{t('dashboard.header.subtitle')}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-warning">{t('dashboard.header.buttons.exportData')}</button>
        <button className="btn btn-warning">{t('dashboard.header.buttons.importData')}</button>
        <button className="btn btn-warning">{t('dashboard.header.buttons.aiInsights')}</button>
        <button className="btn btn-warning">{t('dashboard.header.buttons.addExpense')}</button>
      </div>
    </div>
  );
} 