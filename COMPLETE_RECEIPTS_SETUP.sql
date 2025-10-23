-- ========================================
-- SETUP COMPLETO PARA RECEIPT SCANNER
-- Ejecuta TODO este SQL en Supabase SQL Editor
-- ========================================

-- PARTE 1: ARREGLAR STORAGE BUCKET Y POLÍTICAS
-- ========================================

-- Eliminar TODAS las políticas antiguas
DROP POLICY IF EXISTS "Users can upload their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload receipts" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view receipts" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads from receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from receipts" ON storage.objects;
DROP POLICY IF EXISTS "receipts_bucket_all_access" ON storage.objects;
DROP POLICY IF EXISTS "receipts_allow_all" ON storage.objects;

-- Crear UNA SOLA política permisiva
CREATE POLICY "receipts_allow_all"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'receipts')
WITH CHECK (bucket_id = 'receipts');

-- Asegurar que el bucket es público
UPDATE storage.buckets
SET public = true
WHERE id = 'receipts';


-- PARTE 2: CREAR TABLA receipt_uploads
-- ========================================

-- Eliminar tabla si existe (para empezar limpio)
DROP TABLE IF EXISTS receipt_uploads CASCADE;

-- Crear tabla
CREATE TABLE receipt_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data JSONB,
  error_message TEXT,
  expense_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE receipt_uploads ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para la tabla
CREATE POLICY "Users can view their own receipt uploads"
ON receipt_uploads
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own receipt uploads"
ON receipt_uploads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipt uploads"
ON receipt_uploads
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receipt uploads"
ON receipt_uploads
FOR DELETE
USING (auth.uid() = user_id);

-- Índices para mejor performance
CREATE INDEX idx_receipt_uploads_user_id ON receipt_uploads(user_id);
CREATE INDEX idx_receipt_uploads_status ON receipt_uploads(status);
CREATE INDEX idx_receipt_uploads_created_at ON receipt_uploads(created_at DESC);


-- VERIFICACIÓN
-- ========================================

-- Verificar que todo está creado
SELECT 'Bucket receipts:' as check, COUNT(*) as count FROM storage.buckets WHERE id = 'receipts';
SELECT 'Table receipt_uploads:' as check, COUNT(*) as count FROM information_schema.tables WHERE table_name = 'receipt_uploads';
SELECT 'Storage policies:' as check, COUNT(*) as count FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%receipts%';
SELECT 'Table policies:' as check, COUNT(*) as count FROM pg_policies WHERE tablename = 'receipt_uploads';

-- ¡LISTO! Ahora la funcionalidad debería funcionar completamente
