import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';
import type { UploadedFile } from '@/types/receipt';

interface ReceiptUploaderProps {
  onFileSelect: (file: File) => void;
  onCancel?: () => void;
  isProcessing?: boolean;
}

export function ReceiptUploader({ onFileSelect, onCancel, isProcessing = false }: ReceiptUploaderProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'image/heif',
      'image/webp',
      'application/pdf'
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Formato no soportado',
        description: 'Por favor usa JPG, PNG, HEIC o PDF',
        variant: 'destructive'
      });
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: 'Archivo demasiado grande',
        description: 'El tamaño máximo es 10MB',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) {
      return;
    }

    logger.info('File selected', { name: file.name, size: file.size, type: file.type });

    // Create preview
    const preview = URL.createObjectURL(file);
    setSelectedFile({ file, preview });
  }, []);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
  };

  const handleProcess = () => {
    if (selectedFile) {
      onFileSelect(selectedFile.file);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="w-16 h-16 text-red-500" />;
    }
    return <ImageIcon className="w-16 h-16 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className={`mb-4 p-4 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-gray-100'}`}>
              <Upload className={`w-12 h-12 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
            </div>

            <h3 className="text-lg font-semibold mb-2">
              {isDragging ? 'Suelta el archivo aquí' : 'Arrastra tu recibo o ticket'}
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              o haz clic para seleccionar un archivo
            </p>

            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,image/webp,application/pdf"
              onChange={handleFileInput}
              disabled={isProcessing}
            />

            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="outline"
                disabled={isProcessing}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Seleccionar archivo
              </Button>
            </label>

            <div className="mt-6 text-xs text-gray-400 space-y-1">
              <p>Formatos soportados: JPG, PNG, HEIC, PDF</p>
              <p>Tamaño máximo: 10MB</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                {selectedFile.file.type === 'application/pdf' ? (
                  <div className="w-24 h-24 bg-red-50 rounded-lg flex items-center justify-center">
                    {getFileIcon(selectedFile.file)}
                  </div>
                ) : (
                  <img
                    src={selectedFile.preview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium truncate">{selectedFile.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {!isProcessing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Procesando con AI...</span>
                    </div>
                    <Progress value={undefined} className="h-1" />
                  </div>
                )}
              </div>
            </div>

            {!isProcessing && (
              <div className="flex gap-2 mt-4">
                <Button onClick={handleProcess} className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Procesar recibo
                </Button>
                {onCancel && (
                  <Button variant="outline" onClick={onCancel}>
                    Cancelar
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
