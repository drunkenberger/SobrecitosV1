import { useState, useCallback, useEffect } from 'react';
import { logger, handleError, AppError } from '@/lib/logger';

interface AsyncState<T> {
  data: T | null;
  error: AppError | null;
  loading: boolean;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
}

/**
 * Hook for managing async operations with loading, error, and data states
 */
export function useAsync<T, Args extends any[] = any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = false, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: immediate,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, error: null, loading: true });

      try {
        const data = await asyncFunction(...args);
        setState({ data, error: null, loading: false });

        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      } catch (error) {
        const appError = handleError(error, asyncFunction.name);
        setState({ data: null, error: appError, loading: false });

        if (onError) {
          onError(appError);
        } else {
          logger.error('Async operation failed', appError);
        }

        throw appError;
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  useEffect(() => {
    if (immediate) {
      execute(...([] as any));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, error: null, loading: false }),
  };
}

/**
 * Hook for mutations with optimistic updates
 */
export function useOptimisticMutation<T, Args extends any[] = any[]>(
  mutationFn: (...args: Args) => Promise<T>,
  options: {
    onMutate?: (...args: Args) => void | Promise<void>;
    onSuccess?: (data: T) => void;
    onError?: (error: AppError, rollback?: () => void) => void;
  } = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const mutate = useCallback(
    async (...args: Args) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Optimistic update
      let rollback: (() => void) | undefined;
      if (options.onMutate) {
        const rollbackData = await options.onMutate(...args);
        rollback = rollbackData as any;
      }

      try {
        const data = await mutationFn(...args);
        setState({ data, error: null, loading: false });

        if (options.onSuccess) {
          options.onSuccess(data);
        }

        return data;
      } catch (error) {
        const appError = handleError(error, mutationFn.name);
        setState({ data: null, error: appError, loading: false });

        if (options.onError) {
          options.onError(appError, rollback);
        } else {
          logger.error('Mutation failed', appError);
        }

        throw appError;
      }
    },
    [mutationFn, options]
  );

  return {
    ...state,
    mutate,
    reset: () => setState({ data: null, error: null, loading: false }),
  };
}
