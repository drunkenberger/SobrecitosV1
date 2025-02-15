import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from "@/types/category";
import type { Expense } from "@/types/expense";

export interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (expense: Expense) => void;
}

type ExpenseFormData = Omit<Expense, 'id'>;

export function ExpenseForm({ categories, onSubmit }: ExpenseFormProps) {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<ExpenseFormData>();

  const handleFormSubmit = (data: ExpenseFormData) => {
    onSubmit({
      ...data,
      id: crypto.randomUUID(),
      date: new Date(data.date)
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">{t('forms.expense.amount')}</Label>
        <Input
          id="amount"
          type="number"
          {...register('amount', { required: true, min: 0 })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">{t('forms.expense.category')}</Label>
        <Select {...register('category', { required: true })}>
          <SelectTrigger>
            <SelectValue placeholder={t('forms.expense.selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {t(`dashboard.categories.${category.name.toLowerCase()}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{t('common.save')}</Button>
    </form>
  );
}

export default ExpenseForm; 