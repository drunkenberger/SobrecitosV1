import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import type { Category } from '@/types/category';
import { FormEvent, useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface ExpenseFormData {
  amount: number;
  category: string;
  description: string;
}

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  categories: Category[];
}

export function ExpenseForm({ onSubmit, onCancel, categories }: ExpenseFormProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Set the first category as default if available
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const resetForm = () => {
    setAmount('');
    setCategory(categories.length > 0 ? categories[0].name : '');
    setDescription('');
    setFormError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    if (!amount || Number(amount) <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }
    
    if (!category) {
      setFormError('Please select a category');
      return;
    }
    
    if (!description) {
      setFormError('Please enter a description');
      return;
    }
    
    const expenseData: ExpenseFormData = {
      amount: Number(amount),
      category: category,
      description: description
    };
    
    console.log('Submitting expense data:', expenseData);
    
    try {
      setIsSubmitting(true);
      await onSubmit(expenseData);
      resetForm();
    } catch (error) {
      console.error('Error submitting expense data:', error);
      setFormError('Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('forms.expense.amount')}</label>
          <input 
            type="number" 
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('forms.expense.category')}</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }} 
                      />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="default">No categories available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('forms.expense.description')}</label>
          <input 
            type="text" 
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            required
            placeholder={t('dashboard.transactions.searchPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        {formError && (
          <div className="text-red-500 text-sm">{formError}</div>
        )}
        
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {t('common.cancel')}
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </div>
    </form>
  );
} 