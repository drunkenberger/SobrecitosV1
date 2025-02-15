import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.subtitle')}</p>
      
      <button>{t('dashboard.buttons.exportData')}</button>
      <button>{t('dashboard.buttons.importData')}</button>
      {/* ... rest of your component using t('dashboard.xyz') ... */}
    </div>
  );
} 