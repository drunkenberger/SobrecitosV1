import { useTranslation } from 'react-i18next';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { Category } from "@/types/category";

interface BudgetSettingsProps {
  monthlyIncome: number;
  categories: Category[];
  onUpdateIncome: (amount: number) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => void;
}

export function BudgetSettings({ 
  monthlyIncome, 
  categories,
  onUpdateIncome,
  onAddCategory 
}: BudgetSettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">
          {t('dashboard.budgetSettings.title')}
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-medium">
              {t('dashboard.budgetSettings.monthlyIncome.title')}
            </h3>
            <div className="mt-2">
              <Input
                type="number"
                value={monthlyIncome}
                onChange={(e) => onUpdateIncome(Number(e.target.value))}
                placeholder={t('dashboard.budgetSettings.monthlyIncome.placeholder')}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">
              {t('dashboard.budgetSettings.categories.title')}
            </h3>
            <div className="mt-2">
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span>${category.budget.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => onAddCategory({
                  name: '',
                  budget: 0,
                  color: '#4CAF50'
                })}
                className="mt-4"
              >
                {t('dashboard.budgetSettings.categories.addButton')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 