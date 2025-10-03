import { toast } from '@/components/ui/use-toast';
import { AppError, ErrorCodes, logger } from './logger';
import { ValidationError } from './validations';

/**
 * Enhanced toast utilities with error handling integration
 */

export const toastUtils = {
  /**
   * Show success message
   */
  success: (message: string, description?: string) => {
    logger.info('Success toast', { message, description });
    toast({
      title: message,
      description,
      variant: 'default',
      duration: 3000,
    });
  },

  /**
   * Show error message with proper error handling
   */
  error: (error: unknown, fallbackMessage = 'An error occurred') => {
    let title = fallbackMessage;
    let description: string | undefined;

    if (error instanceof AppError) {
      title = error.message;
      description = getErrorDescription(error.code);
      logger.error('App error toast', error, { code: error.code });
    } else if (error instanceof ValidationError) {
      title = 'Validation Error';
      description = error.getFirstError();
      logger.warn('Validation error toast', { errors: error.getErrors() });
    } else if (error instanceof Error) {
      title = error.message;
      logger.error('Generic error toast', error);
    } else {
      title = String(error);
      logger.error('Unknown error toast', new Error(String(error)));
    }

    toast({
      title,
      description,
      variant: 'destructive',
      duration: 5000,
    });
  },

  /**
   * Show warning message
   */
  warning: (message: string, description?: string) => {
    logger.warn('Warning toast', { message, description });
    toast({
      title: message,
      description,
      variant: 'default',
      duration: 4000,
    });
  },

  /**
   * Show info message
   */
  info: (message: string, description?: string) => {
    logger.info('Info toast', { message, description });
    toast({
      title: message,
      description,
      variant: 'default',
      duration: 3000,
    });
  },

  /**
   * Show loading toast (returns dismiss function)
   */
  loading: (message: string) => {
    logger.debug('Loading toast', { message });
    const { dismiss } = toast({
      title: message,
      description: 'Please wait...',
      duration: Infinity,
    });
    return dismiss;
  },

  /**
   * Promise-based toast (shows loading, then success/error)
   */
  promise: async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error?: string;
    }
  ): Promise<T> => {
    const dismiss = toastUtils.loading(messages.loading);

    try {
      const result = await promise;
      dismiss();
      toastUtils.success(messages.success);
      return result;
    } catch (error) {
      dismiss();
      toastUtils.error(error, messages.error);
      throw error;
    }
  },
};

/**
 * Get user-friendly description for error codes
 */
function getErrorDescription(code: string): string | undefined {
  const descriptions: Record<string, string> = {
    [ErrorCodes.VALIDATION_ERROR]: 'Please check your input and try again.',
    [ErrorCodes.INVALID_INPUT]: 'The information provided is invalid.',
    [ErrorCodes.AUTH_REQUIRED]: 'Please sign in to continue.',
    [ErrorCodes.AUTH_FAILED]: 'Authentication failed. Please check your credentials.',
    [ErrorCodes.SESSION_EXPIRED]: 'Your session has expired. Please sign in again.',
    [ErrorCodes.NOT_FOUND]: 'The requested item was not found.',
    [ErrorCodes.ALREADY_EXISTS]: 'This item already exists.',
    [ErrorCodes.DATA_CONFLICT]: 'There was a conflict with existing data.',
    [ErrorCodes.NETWORK_ERROR]: 'Network error. Please check your connection.',
    [ErrorCodes.TIMEOUT]: 'Request timed out. Please try again.',
    [ErrorCodes.CLOUD_SYNC_FAILED]: 'Failed to sync with cloud. Your data is saved locally.',
    [ErrorCodes.STORAGE_QUOTA_EXCEEDED]: 'Storage quota exceeded. Please free up some space.',
  };

  return descriptions[code];
}

/**
 * Convenience function for async operations with toast feedback
 */
export async function withToast<T>(
  operation: () => Promise<T>,
  messages: {
    loading: string;
    success: string;
    error?: string;
  }
): Promise<T | null> {
  try {
    return await toastUtils.promise(operation(), messages);
  } catch (error) {
    return null;
  }
}
