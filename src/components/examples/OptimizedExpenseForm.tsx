/**
 * Example: Expense Form with UX Improvements
 *
 * This demonstrates how to use the new UX utilities:
 * - Loading states
 * - Toast notifications
 * - Optimistic updates
 * - Error handling
 * - Validation feedback
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner, LoadingOverlay } from '@/components/ui/loading';
import { toastUtils } from '@/lib/toast-utils';
import { validate, expenseInputSchema, ValidationError } from '@/lib/validations';
import { useStore } from '@/lib/store';
import { useOptimisticMutation } from '@/hooks/useAsync';
import { logger } from '@/lib/logger';

export function OptimizedExpenseForm({ onSuccess }: { onSuccess?: () => void }) {
  const { addExpense } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);

  // Use optimistic mutation hook
  const { mutate, loading } = useOptimisticMutation(
    async (data: any) => {
      // Validate data
      const validData = validate(expenseInputSchema, data);

      // Add expense
      await addExpense(validData);

      return validData;
    },
    {
      onMutate: (data) => {
        logger.info('Adding expense optimistically', { data });
        // Could add optimistic update to UI here
      },
      onSuccess: () => {
        setShowSuccess(true);
        toastUtils.success('Expense added successfully!', 'Your expense has been recorded.');

        // Hide success message after animation
        setTimeout(() => setShowSuccess(false), 2000);

        if (onSuccess) onSuccess();
      },
      onError: (error, rollback) => {
        toastUtils.error(error);
        if (rollback) rollback();
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(expenseInputSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await mutate(data);
      reset();
    } catch (error) {
      // Error already handled by mutation hook
      logger.debug('Form submission failed', { error });
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      <LoadingOverlay isLoading={loading} message="Adding expense..." />

      {/* Success Animation */}
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center z-40 bg-green-50 rounded-lg animate-in fade-in duration-300">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-green-700">Success!</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Amount Field */}
        <div className="space-y-2">
          <Label htmlFor="amount">
            Amount <span className="text-red-500">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('amount', { valueAsNumber: true })}
            disabled={loading}
            className={errors.amount ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.amount && (
            <p className="text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
              {errors.amount.message as string}
            </p>
          )}
        </div>

        {/* Category Field */}
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Input
            id="category"
            placeholder="e.g., groceries"
            {...register('category')}
            disabled={loading}
            className={errors.category ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.category && (
            <p className="text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
              {errors.category.message as string}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Input
            id="description"
            placeholder="What did you buy?"
            {...register('description')}
            disabled={loading}
            className={errors.description ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-500 animate-in slide-in-from-top-1 duration-200">
              {errors.description.message as string}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || isSubmitting}
          className="w-full transition-all hover:scale-105 active:scale-95"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Adding...
            </>
          ) : (
            'Add Expense'
          )}
        </Button>
      </form>
    </div>
  );
}

// ============================================
// USAGE EXAMPLE
// ============================================

/**
 * How to use in your components:
 *
 * import { OptimizedExpenseForm } from '@/components/examples/OptimizedExpenseForm';
 *
 * function MyComponent() {
 *   return (
 *     <OptimizedExpenseForm
 *       onSuccess={() => {
 *         // Refresh data, close modal, etc.
 *       }}
 *     />
 *   );
 * }
 */
