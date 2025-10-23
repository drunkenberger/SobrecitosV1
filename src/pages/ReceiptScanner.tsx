import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ScanLine, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReceiptScanner as ReceiptScannerComponent } from '@/components/receipts/ReceiptScanner';
import SEO from '@/components/SEO';

export default function ReceiptScannerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigate back to transactions or home after successful upload
    navigate('/app/transactions');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <SEO
        title="Escanear Recibo | Sobrecitos"
        description="Escanea tus recibos y tickets de compra con IA para agregar gastos automáticamente"
      />

      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <ScanLine className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Escanear Recibo</h1>
              <p className="text-gray-600 mt-1">
                Sube una foto de tu recibo o ticket y nuestra IA extraerá la información automáticamente
              </p>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Cómo funciona:</strong> Sube una foto clara de tu recibo o estado de cuenta.
            Nuestra IA extraerá la fecha, monto, comercio y categorizará el gasto automáticamente.
            Podrás revisar y editar la información antes de agregarla a tus gastos.
          </AlertDescription>
        </Alert>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Formatos Soportados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• JPG, PNG, HEIC</li>
                <li>• PDFs (estados de cuenta)</li>
                <li>• Máximo 10MB</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Extracción Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Fecha de compra</li>
                <li>• Monto total</li>
                <li>• Nombre del comercio</li>
                <li>• Categoría sugerida</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacidad</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Procesamiento seguro</li>
                <li>• Sin almacenamiento en IA</li>
                <li>• Tus datos privados</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Scanner Component */}
        <Card>
          <CardHeader>
            <CardTitle>Subir Recibo</CardTitle>
            <CardDescription>
              Arrastra tu recibo aquí o haz clic para seleccionar un archivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReceiptScannerComponent
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Consejos para mejores resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Toma la foto con buena iluminación y evita sombras</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Asegúrate de que todo el texto sea legible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Coloca el recibo sobre una superficie plana</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Para PDFs, asegúrate de que el texto sea seleccionable (no imagen escaneada)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
