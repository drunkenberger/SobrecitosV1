import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import type { Category } from '@/types/category';
import { FormEvent } from 'react';

export interface ExpenseFormData {
  amount: number;
  category: string;
  description: string;
}

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseFormData) => void;
  categories: Category[];
}

export function ExpenseForm({ onSubmit, categories }: ExpenseFormProps) {
  const { t } = useTranslation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const expenseData: ExpenseFormData = {
      amount: Number(formData.get('amount')),
      category: String(formData.get('category')),
      description: String(formData.get('description') || '')
    };
    
    onSubmit(expenseData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('forms.expense.amount')}</label>
          <input 
            type="number" 
            name="amount"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('forms.expense.category')}</label>
          <select 
            name="category"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
          >
            <option value="">{t('dashboard.transactions.allCategories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {t(`dashboard.categories.${category.name.toLowerCase()}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('forms.expense.description')}</label>
          <input 
            type="text" 
            name="description"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
            placeholder={t('dashboard.transactions.searchPlaceholder')}
          />
        </div>
        <Button type="submit" className="w-full">
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
} 