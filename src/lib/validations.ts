import { z } from 'zod';

// ============================================
// BASE SCHEMAS
// ============================================

export const currencySchema = z.object({
  code: z.string().length(3),
  symbol: z.string().min(1),
  name: z.string().min(1),
});

// ============================================
// INCOME SCHEMAS
// ============================================

export const incomeSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1, 'Description is required').max(200),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().datetime(),
});

export const incomeInputSchema = incomeSchema.omit({ id: true, date: true });

// ============================================
// CATEGORY SCHEMAS
// ============================================

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Category name is required').max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  budget: z.number().nonnegative('Budget cannot be negative'),
  isRecurring: z.boolean().optional(),
});

export const categoryInputSchema = categorySchema.omit({ id: true });

// ============================================
// EXPENSE SCHEMAS
// ============================================

export const expenseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required').max(200),
  date: z.string().datetime(),
  isRecurring: z.boolean().optional(),
  recurringType: z.enum(['weekly', 'monthly']).optional(),
  recurringDay: z.number().min(1).max(31).optional(),
  currency: currencySchema.optional(),
});

export const expenseInputSchema = z.object({
  id: z.string().uuid().optional(),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required').max(200),
});

// ============================================
// SAVINGS GOAL SCHEMAS
// ============================================

export const savingsGoalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Goal name is required').max(100),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().nonnegative('Current amount cannot be negative'),
  deadline: z.string().datetime(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
}).refine((data) => data.currentAmount <= data.targetAmount, {
  message: 'Current amount cannot exceed target amount',
  path: ['currentAmount'],
});

export const savingsGoalInputSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100),
  targetAmount: z.number().positive('Target amount must be positive'),
  currentAmount: z.number().nonnegative('Current amount cannot be negative'),
  deadline: z.string().datetime(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
}).refine((data) => data.currentAmount <= data.targetAmount, {
  message: 'Current amount cannot exceed target amount',
  path: ['currentAmount'],
});

// ============================================
// FUTURE PAYMENT SCHEMAS
// ============================================

export const futurePaymentSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1, 'Description is required').max(200),
  amount: z.number().positive('Amount must be positive'),
  dueDate: z.string().datetime(),
  category: z.string().min(1, 'Category is required'),
  isPaid: z.boolean(),
});

export const futurePaymentInputSchema = futurePaymentSchema.omit({ id: true, isPaid: true });

// ============================================
// DEBT SCHEMAS
// ============================================

export const debtSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Debt name is required').max(100),
  creditor: z.string().min(1, 'Creditor is required').max(100),
  totalAmount: z.number().positive('Total amount must be positive'),
  remainingAmount: z.number().nonnegative('Remaining amount cannot be negative'),
  interestRate: z.number().min(0).max(100).optional(),
  minimumPayment: z.number().positive('Minimum payment must be positive'),
  dueDate: z.string().datetime(),
  createdDate: z.string().datetime(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  type: z.enum(['credit_card', 'loan', 'mortgage', 'student_loan', 'personal', 'other']),
  description: z.string().max(500).optional(),
}).refine((data) => data.remainingAmount <= data.totalAmount, {
  message: 'Remaining amount cannot exceed total amount',
  path: ['remainingAmount'],
});

export const debtInputSchema = z.object({
  name: z.string().min(1, 'Debt name is required').max(100),
  creditor: z.string().min(1, 'Creditor is required').max(100),
  totalAmount: z.number().positive('Total amount must be positive'),
  remainingAmount: z.number().nonnegative('Remaining amount cannot be negative'),
  interestRate: z.number().min(0).max(100).optional(),
  minimumPayment: z.number().positive('Minimum payment must be positive'),
  dueDate: z.string().datetime(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  type: z.enum(['credit_card', 'loan', 'mortgage', 'student_loan', 'personal', 'other']),
  description: z.string().max(500).optional(),
}).refine((data) => data.remainingAmount <= data.totalAmount, {
  message: 'Remaining amount cannot exceed total amount',
  path: ['remainingAmount'],
});

export const debtPaymentSchema = z.object({
  id: z.string().uuid(),
  debtId: z.string().uuid(),
  amount: z.number().positive('Payment amount must be positive'),
  date: z.string().datetime(),
  type: z.enum(['minimum', 'extra', 'payoff']),
  description: z.string().max(200).optional(),
});

export const debtPaymentInputSchema = debtPaymentSchema.omit({ id: true, date: true });

// ============================================
// INVESTMENT SCHEMAS
// ============================================

export const investmentTypeSchema = z.enum([
  'stocks', 'etf', 'mutual_funds', 'index_funds',
  'government_bonds', 'corporate_bonds', 'municipal_bonds', 'treasury_bills',
  'bitcoin', 'ethereum', 'altcoins', 'crypto_index',
  'gold', 'silver', 'platinum', 'oil', 'natural_gas', 'agricultural', 'commodity_etf',
  'residential_property', 'commercial_property', 'reits', 'real_estate_funds',
  'private_equity', 'hedge_funds', 'venture_capital', 'collectibles', 'art',
  'savings_account', 'cd', 'money_market', 'other'
]);

export const investmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Investment name is required').max(100),
  type: investmentTypeSchema,
  platform: z.string().min(1, 'Platform is required').max(100),
  currentValue: z.number().nonnegative('Current value cannot be negative'),
  purchaseValue: z.number().positive('Purchase value must be positive'),
  shares: z.number().positive().optional(),
  purchaseDate: z.string().datetime(),
  lastUpdated: z.string().datetime(),
  symbol: z.string().max(10).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  description: z.string().max(500).optional(),
  isConnected: z.boolean().optional(),
});

export const investmentInputSchema = investmentSchema.omit({ id: true, lastUpdated: true });

export const investmentTransactionSchema = z.object({
  id: z.string().uuid(),
  investmentId: z.string().uuid(),
  type: z.enum(['buy', 'sell', 'dividend', 'fee']),
  amount: z.number().positive('Amount must be positive'),
  shares: z.number().positive().optional(),
  price: z.number().positive().optional(),
  date: z.string().datetime(),
  description: z.string().max(200).optional(),
});

export const investmentTransactionInputSchema = investmentTransactionSchema.omit({ id: true });

// ============================================
// BUDGET STORE SCHEMA
// ============================================

export const budgetStoreSchema = z.object({
  monthlyBudget: z.number().nonnegative('Monthly budget cannot be negative'),
  additionalIncomes: z.array(incomeSchema),
  categories: z.array(categorySchema),
  expenses: z.array(expenseSchema),
  savingsGoals: z.array(savingsGoalSchema),
  futurePayments: z.array(futurePaymentSchema),
  debts: z.array(debtSchema),
  debtPayments: z.array(debtPaymentSchema),
  investments: z.array(investmentSchema),
  investmentTransactions: z.array(investmentTransactionSchema),
  currency: currencySchema,
});

// ============================================
// TYPE EXPORTS
// ============================================

export type Income = z.infer<typeof incomeSchema>;
export type IncomeInput = z.infer<typeof incomeInputSchema>;
export type Category = z.infer<typeof categorySchema>;
export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type ExpenseInput = z.infer<typeof expenseInputSchema>;
export type SavingsGoal = z.infer<typeof savingsGoalSchema>;
export type SavingsGoalInput = z.infer<typeof savingsGoalInputSchema>;
export type FuturePayment = z.infer<typeof futurePaymentSchema>;
export type FuturePaymentInput = z.infer<typeof futurePaymentInputSchema>;
export type Debt = z.infer<typeof debtSchema>;
export type DebtInput = z.infer<typeof debtInputSchema>;
export type DebtPayment = z.infer<typeof debtPaymentSchema>;
export type DebtPaymentInput = z.infer<typeof debtPaymentInputSchema>;
export type Investment = z.infer<typeof investmentSchema>;
export type InvestmentInput = z.infer<typeof investmentInputSchema>;
export type InvestmentTransaction = z.infer<typeof investmentTransactionSchema>;
export type InvestmentTransactionInput = z.infer<typeof investmentTransactionInputSchema>;
export type BudgetStore = z.infer<typeof budgetStoreSchema>;

// ============================================
// VALIDATION HELPERS
// ============================================

export class ValidationError extends Error {
  constructor(public errors: z.ZodError) {
    super('Validation failed');
    this.name = 'ValidationError';
  }

  getErrors() {
    return this.errors.format();
  }

  getFirstError(): string {
    return this.errors.errors[0]?.message || 'Validation failed';
  }
}

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  return result.data;
}

export function validatePartial<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown
): Partial<z.infer<z.ZodObject<T>>> {
  const partialSchema = schema.partial();
  const result = partialSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  return result.data;
}
