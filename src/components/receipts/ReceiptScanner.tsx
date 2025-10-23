import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReceiptUploader } from './ReceiptUploader';
import { ReceiptReviewModal } from './ReceiptReviewModal';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/lib/store';
import { logger, handleError } from '@/lib/logger';
import {
  uploadReceiptFile,
  createReceiptUploadRecord,
  processReceiptWithAI,
  getReceiptUrl,
  updateReceiptUploadStatus
} from '@/lib/receipt-service';
import type { ExtractedReceiptData } from '@/types/receipt';

interface ReceiptScannerProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReceiptScanner({ onSuccess, onCancel }: ReceiptScannerProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { addExpense } = useStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string>('');
  const [currentUploadId, setCurrentUploadId] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);

    try {
      logger.info('Starting receipt processing', {
        fileName: file.name,
        fileSize: file.size
      });

      toast({
        title: 'Subiendo recibo...',
        description: 'Por favor espera mientras procesamos tu recibo',
      });

      // 1. Upload file to Supabase Storage
      const filePath = await uploadReceiptFile(file);
      logger.info('File uploaded', { filePath });

      // 2. Create database record
      const uploadId = await createReceiptUploadRecord(
        filePath,
        file.name,
        file.size,
        file.type
      );
      setCurrentUploadId(uploadId);
      logger.info('Upload record created', { uploadId });

      // 3. Get public URL
      const publicUrl = await getReceiptUrl(filePath);
      setReceiptImageUrl(publicUrl);

      toast({
        title: 'Procesando con AI...',
        description: 'Extrayendo información del recibo',
      });

      // 4. Process with AI
      const result = await processReceiptWithAI(filePath, uploadId);

      if (result.success && result.data) {
        logger.info('Receipt processed successfully', {
          uploadId,
          merchant: result.data.merchant,
          amount: result.data.amount
        });

        setExtractedData(result.data);
        setShowReviewModal(true);

        toast({
          title: 'Recibo procesado',
          description: 'Revisa la información extraída',
          variant: 'default'
        });
      } else {
        throw new Error(result.error || 'Error al procesar el recibo');
      }

    } catch (error) {
      const appError = handleError(error, 'handleFileSelect');

      toast({
        title: 'Error al procesar recibo',
        description: appError.message,
        variant: 'destructive'
      });

      logger.error('Receipt processing failed', appError, {
        fileName: file.name
      });

    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmExpense = async (data: {
    date: string;
    amount: number;
    merchant: string;
    category: string;
    description?: string;
  }) => {
    try {
      logger.info('Adding expense from receipt', {
        uploadId: currentUploadId,
        amount: data.amount,
        category: data.category
      });

      // Add expense to store
      await addExpense({
        amount: data.amount,
        category: data.category,
        description: data.description || `Compra en ${data.merchant}`
      });

      // Update upload record with expense ID (we would need to get the expense ID from addExpense)
      // For now, just mark as completed
      if (currentUploadId) {
        await updateReceiptUploadStatus(currentUploadId, 'completed', extractedData || undefined);
      }

      toast({
        title: 'Gasto agregado',
        description: `Se agregó el gasto de $${data.amount} en ${data.category}`,
        variant: 'default'
      });

      logger.info('Expense added successfully', {
        uploadId: currentUploadId,
        category: data.category
      });

      // Reset state
      setShowReviewModal(false);
      setExtractedData(null);
      setReceiptImageUrl('');
      setCurrentUploadId('');

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      const appError = handleError(error, 'handleConfirmExpense');

      toast({
        title: 'Error al agregar gasto',
        description: appError.message,
        variant: 'destructive'
      });

      logger.error('Failed to add expense', appError, {
        uploadId: currentUploadId
      });
    }
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setExtractedData(null);
    setReceiptImageUrl('');
    setCurrentUploadId('');
  };

  return (
    <div className="space-y-4">
      <ReceiptUploader
        onFileSelect={handleFileSelect}
        onCancel={onCancel}
        isProcessing={isProcessing}
      />

      {extractedData && (
        <ReceiptReviewModal
          isOpen={showReviewModal}
          onClose={handleCloseReviewModal}
          extractedData={extractedData}
          receiptImageUrl={receiptImageUrl}
          onConfirm={handleConfirmExpense}
        />
      )}
    </div>
  );
}
