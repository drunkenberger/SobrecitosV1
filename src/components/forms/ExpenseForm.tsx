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

interface ExpenseFormData {
  amount: number;
  category: string;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<ExpenseFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <SelectItem value="groceries">{t('dashboard.categories.groceries')}</SelectItem>
            <SelectItem value="utilities">{t('dashboard.categories.utilities')}</SelectItem>
            <SelectItem value="entertainment">{t('dashboard.categories.entertainment')}</SelectItem>
            <SelectItem value="salad">{t('dashboard.categories.salad')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{t('common.save')}</Button>
    </form>
  );
} 