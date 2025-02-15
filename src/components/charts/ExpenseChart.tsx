import { useTranslation } from 'react-i18next';

export function ExpenseChart({ data }) {
  const { t } = useTranslation();

  const categories = {
    groceries: t('dashboard.categories.groceries'),
    utilities: t('dashboard.categories.utilities'),
    entertainment: t('dashboard.categories.entertainment'),
    salad: t('dashboard.categories.salad')
  };

  return (
    <div>
      {/* Your chart implementation */}
      <div className="legend">
        {Object.entries(categories).map(([key, label]) => (
          <div key={key} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: colors[key] }}></span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 