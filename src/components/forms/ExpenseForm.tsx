import { useTranslation } from 'react-i18next';

export function ExpenseForm({ onSubmit }) {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label>{t('forms.expense.amount')}</label>
          <input type="number" />
        </div>
        <div>
          <label>{t('forms.expense.category')}</label>
          <select>
            <option value="groceries">{t('dashboard.categories.groceries')}</option>
            <option value="utilities">{t('dashboard.categories.utilities')}</option>
            <option value="entertainment">{t('dashboard.categories.entertainment')}</option>
            <option value="salad">{t('dashboard.categories.salad')}</option>
          </select>
        </div>
        <Button type="submit">{t('common.save')}</Button>
      </div>
    </form>
  );
} 