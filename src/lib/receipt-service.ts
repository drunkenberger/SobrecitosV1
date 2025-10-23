import { supabase } from './supabase';
import { logger, handleError, AppError, ErrorCodes } from './logger';
import type { ReceiptUpload, ExtractedReceiptData, ReceiptProcessingResult } from '@/types/receipt';

const BUCKET_NAME = 'receipts';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
  'application/pdf'
];

/**
 * Upload receipt file to Supabase Storage
 */
export async function uploadReceiptFile(file: File): Promise<string> {
  try {
    // Validate file
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new AppError(
        'Formato de archivo no soportado. Usa JPG, PNG, HEIC o PDF.',
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(
        'El archivo es demasiado grande. Máximo 10MB.',
        ErrorCodes.VALIDATION_ERROR,
        400
      );
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new AppError(
        'Usuario no autenticado',
        ErrorCodes.AUTH_ERROR,
        401
      );
    }

    // Generate unique file path
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;
    const filePath = `${user.id}/${fileName}`;

    logger.info('Uploading receipt file', { fileName, fileSize: file.size, mimeType: file.type });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new AppError(
        'Error al subir el archivo',
        ErrorCodes.STORAGE_ERROR,
        500,
        error
      );
    }

    logger.info('Receipt file uploaded successfully', { path: data.path });

    return data.path;
  } catch (error) {
    const appError = handleError(error, 'uploadReceiptFile');
    throw appError;
  }
}

/**
 * Get public URL for receipt file
 */
export async function getReceiptUrl(filePath: string): Promise<string> {
  try {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    const appError = handleError(error, 'getReceiptUrl');
    throw appError;
  }
}

/**
 * Create receipt upload record in database
 */
export async function createReceiptUploadRecord(
  filePath: string,
  fileName: string,
  fileSize: number,
  mimeType: string
): Promise<string> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new AppError(
        'Usuario no autenticado',
        ErrorCodes.AUTH_ERROR,
        401
      );
    }

    const { data, error } = await supabase
      .from('receipt_uploads')
      .insert({
        user_id: user.id,
        file_path: filePath,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      throw new AppError(
        'Error al crear registro de recibo',
        ErrorCodes.DATABASE_ERROR,
        500,
        error
      );
    }

    logger.info('Receipt upload record created', { uploadId: data.id });

    return data.id;
  } catch (error) {
    const appError = handleError(error, 'createReceiptUploadRecord');
    throw appError;
  }
}

/**
 * Update receipt upload status
 */
export async function updateReceiptUploadStatus(
  uploadId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  extractedData?: ExtractedReceiptData,
  errorMessage?: string,
  expenseId?: string
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'processing' || status === 'completed') {
      updateData.processed_at = new Date().toISOString();
    }

    if (extractedData) {
      updateData.extracted_data = extractedData;
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    if (expenseId) {
      updateData.expense_id = expenseId;
    }

    const { error } = await supabase
      .from('receipt_uploads')
      .update(updateData)
      .eq('id', uploadId);

    if (error) {
      throw new AppError(
        'Error al actualizar estado del recibo',
        ErrorCodes.DATABASE_ERROR,
        500,
        error
      );
    }

    logger.info('Receipt upload status updated', { uploadId, status });
  } catch (error) {
    const appError = handleError(error, 'updateReceiptUploadStatus');
    throw appError;
  }
}

/**
 * Get user's receipt uploads
 */
export async function getUserReceiptUploads(limit = 50): Promise<ReceiptUpload[]> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new AppError(
        'Usuario no autenticado',
        ErrorCodes.AUTH_ERROR,
        401
      );
    }

    const { data, error } = await supabase
      .from('receipt_uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new AppError(
        'Error al obtener recibos',
        ErrorCodes.DATABASE_ERROR,
        500,
        error
      );
    }

    return data as ReceiptUpload[];
  } catch (error) {
    const appError = handleError(error, 'getUserReceiptUploads');
    throw appError;
  }
}

/**
 * Delete receipt file and record
 */
export async function deleteReceipt(uploadId: string, filePath: string): Promise<void> {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (storageError) {
      logger.warn('Error deleting file from storage', { error: storageError });
    }

    // Delete record
    const { error: dbError } = await supabase
      .from('receipt_uploads')
      .delete()
      .eq('id', uploadId);

    if (dbError) {
      throw new AppError(
        'Error al eliminar recibo',
        ErrorCodes.DATABASE_ERROR,
        500,
        dbError
      );
    }

    logger.info('Receipt deleted successfully', { uploadId });
  } catch (error) {
    const appError = handleError(error, 'deleteReceipt');
    throw appError;
  }
}

/**
 * Process receipt with AI (calls Netlify function)
 */
export async function processReceiptWithAI(
  filePath: string,
  uploadId: string
): Promise<ReceiptProcessingResult> {
  try {
    // Update status to processing
    await updateReceiptUploadStatus(uploadId, 'processing');

    // Get public URL for the image
    const publicUrl = await getReceiptUrl(filePath);

    logger.info('Processing receipt with AI', { uploadId, filePath });

    // Call Netlify function
    const response = await fetch('/.netlify/functions/process-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl: publicUrl,
        uploadId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AppError(
        'Error al procesar el recibo con AI',
        ErrorCodes.EXTERNAL_API_ERROR,
        response.status,
        new Error(errorText)
      );
    }

    const result = await response.json();

    if (result.success && result.data) {
      // Update status to completed
      await updateReceiptUploadStatus(uploadId, 'completed', result.data);

      logger.info('Receipt processed successfully', { uploadId, confidence: result.data.confidence });

      return {
        success: true,
        data: result.data,
        uploadId
      };
    } else {
      // Update status to failed
      await updateReceiptUploadStatus(uploadId, 'failed', undefined, result.error);

      logger.error('Receipt processing failed', new Error(result.error), { uploadId });

      return {
        success: false,
        error: result.error || 'Error desconocido al procesar el recibo'
      };
    }
  } catch (error) {
    // Update status to failed
    await updateReceiptUploadStatus(uploadId, 'failed', undefined, (error as Error).message);

    const appError = handleError(error, 'processReceiptWithAI');
    return {
      success: false,
      error: appError.message
    };
  }
}
