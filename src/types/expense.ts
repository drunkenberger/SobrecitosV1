export interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
  isRecurring?: boolean;
  recurringType?: 'monthly' | 'weekly' | 'yearly';
  tags?: string[];
  paymentMethod?: string;
} 