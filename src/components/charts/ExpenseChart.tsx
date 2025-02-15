import { useTranslation } from 'react-i18next';

interface ExpenseData {
  [key: string]: number;
}

export function ExpenseChart({ data }: { data: ExpenseData }) {
  const { t } = useTranslation();
  const total = Object.values(data).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([category, amount]) => {
        const percentage = total > 0 ? (amount / total) * 100 : 0;
        return (
          <div key={category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)` }}
              />
              <span>{t(`dashboard.categories.${category.toLowerCase()}`)}</span>
            </div>
            <div className="text-right">
              <div>${amount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 