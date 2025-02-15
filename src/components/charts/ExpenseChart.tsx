import { useTranslation } from 'react-i18next';

interface ExpenseData {
  groceries: number;
  utilities: number;
  entertainment: number;
  salad: number;
}

const colors = {
  groceries: '#4CAF50',
  utilities: '#2196F3',
  entertainment: '#FFC107',
  salad: '#F44336'
};

export function ExpenseChart({ data }: { data: ExpenseData }) {
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
            <span className="legend-color" style={{ backgroundColor: colors[key as keyof typeof colors] }}></span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 