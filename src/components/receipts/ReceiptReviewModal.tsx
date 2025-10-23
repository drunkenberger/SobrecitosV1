import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Calendar, DollarSign, Store, Tag } from 'lucide-react';
import type { ExtractedReceiptData } from '@/types/receipt';
import { useStore } from '@/lib/store';

const expenseSchema = z.object({
  date: z.string().min(1, 'Fecha requerida'),
  amount: z.number().positive('Monto debe ser mayor a 0'),
  merchant: z.string().min(1, 'Comercio requerido'),
  category: z.string().min(1, 'Categoría requerida'),
  description: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ReceiptReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  extractedData: ExtractedReceiptData;
  receiptImageUrl?: string;
  onConfirm: (data: ExpenseFormData) => Promise<void>;
}

export function ReceiptReviewModal({
  isOpen,
  onClose,
  extractedData,
  receiptImageUrl,
  onConfirm
}: ReceiptReviewModalProps) {
  const { t } = useTranslation();
  const { categories } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: extractedData.date,
      amount: extractedData.amount,
      merchant: extractedData.merchant,
      category: extractedData.category,
      description: extractedData.notes || `Compra en ${extractedData.merchant}`
    }
  });

  const selectedCategory = watch('category');

  // Update form when extractedData changes
  useEffect(() => {
    setValue('date', extractedData.date);
    setValue('amount', extractedData.amount);
    setValue('merchant', extractedData.merchant);
    setValue('category', extractedData.category);
    setValue('description', extractedData.notes || `Compra en ${extractedData.merchant}`);
  }, [extractedData, setValue]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return <Badge variant="default" className="bg-green-500">Alta confianza</Badge>;
    if (confidence >= 0.6) return <Badge variant="default" className="bg-yellow-500">Confianza media</Badge>;
    return <Badge variant="destructive">Baja confianza - Revisar</Badge>;
  };

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      setIsSubmitting(true);
      await onConfirm(data);
      onClose();
    } catch (error) {
      console.error('Error confirming expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Revisar información extraída
          </DialogTitle>
          <DialogDescription>
            Revisa y edita los datos extraídos del recibo antes de agregarlos a tus gastos
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview */}
          {receiptImageUrl && (
            <div>
              <Label>Vista previa del recibo</Label>
              <Card className="mt-2">
                <CardContent className="p-4">
                  <img
                    src={receiptImageUrl}
                    alt="Receipt"
                    className="w-full h-auto rounded border"
                  />
                </CardContent>
              </Card>

              {/* Confidence indicator */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confianza de extracción:</span>
                  {getConfidenceBadge(extractedData.confidence)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      extractedData.confidence >= 0.8
                        ? 'bg-green-500'
                        : extractedData.confidence >= 0.6
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${extractedData.confidence * 100}%` }}
                  />
                </div>
              </div>

              {extractedData.confidence < 0.8 && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    La confianza de extracción es {extractedData.confidence < 0.6 ? 'baja' : 'media'}.
                    Por favor revisa cuidadosamente los datos.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Date */}
            <div>
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                className="mt-1"
              />
              {errors.date && (
                <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Monto ({extractedData.currency})
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
              )}
              {extractedData.taxAmount && (
                <p className="text-xs text-gray-500 mt-1">
                  Incluye impuesto: ${extractedData.taxAmount.toFixed(2)}
                </p>
              )}
            </div>

            {/* Merchant */}
            <div>
              <Label htmlFor="merchant" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Comercio
              </Label>
              <Input
                id="merchant"
                {...register('merchant')}
                className="mt-1"
                placeholder="Nombre del comercio"
              />
              {errors.merchant && (
                <p className="text-sm text-red-500 mt-1">{errors.merchant.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Categoría
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                  {/* Suggested category */}
                  {!categories.find(c => c.name === extractedData.category) && (
                    <SelectItem value={extractedData.category}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        {extractedData.category} (sugerida)
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea
                id="description"
                {...register('description')}
                className="mt-1"
                rows={3}
                placeholder="Notas adicionales sobre esta compra..."
              />
            </div>

            {/* Items (read-only) */}
            {extractedData.items && extractedData.items.length > 0 && (
              <div>
                <Label>Items detectados</Label>
                <Card className="mt-2">
                  <CardContent className="p-4">
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {extractedData.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm border-b pb-1 last:border-0"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Agregando...' : 'Agregar gasto'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
