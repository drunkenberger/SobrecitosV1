# 🛠️ Guía para Arreglar el Receipt Scanner

## Problemas Identificados

1. ❌ **Tabla `receipt_uploads` no existe** (Error 404)
2. ❌ **Content Security Policy bloqueando Google Fonts**
3. ❌ **Modelo GPT-4 Vision deprecado**
4. ⚠️ **Posible error ERR_NAME_NOT_RESOLVED** en función Netlify

---

## ✅ Soluciones Aplicadas (Ya corregidas en el código)

### 1. Content Security Policy (netlify.toml)
**Ya corregido ✅**

Se actualizó la política CSP para permitir Google Fonts:
```toml
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' data: https://fonts.gstatic.com;
```

### 2. Modelo GPT-4 Vision (netlify/functions/process-receipt.ts)
**Ya corregido ✅**

Se actualizó de `gpt-4-vision-preview` a `gpt-4o` (modelo actual de OpenAI).

---

## 🔧 Pasos que DEBES hacer manualmente

### Paso 1: Verificar el estado actual

Abre el archivo de diagnóstico en tu navegador:
```bash
# Abre este archivo en tu navegador:
check-receipt-db.html
```

Este archivo verificará automáticamente:
- ✓ Si la tabla `receipt_uploads` existe
- ✓ Si el bucket `receipts` existe en Storage
- ✓ Si la configuración de Supabase es correcta

### Paso 2: Crear la tabla en Supabase

**IMPORTANTE:** La tabla `receipt_uploads` NO existe todavía.

1. **Ve al SQL Editor de Supabase:**
   https://supabase.com/dashboard/project/iyrhkdrblbaiyiftgrhv/sql

2. **Copia TODO el contenido del archivo:**
   `COMPLETE_RECEIPTS_SETUP.sql`

3. **Pégalo en el SQL Editor**

4. **Haz clic en "Run"** (botón verde ▶️)

5. **Verifica que se ejecutó correctamente:**
   - Deberías ver mensajes de éxito
   - Ve a "Table Editor" → deberías ver la tabla `receipt_uploads`

### Paso 3: Verificar el bucket de Storage

1. **Ve a Storage:**
   https://supabase.com/dashboard/project/iyrhkdrblbaiyiftgrhv/storage/buckets

2. **Verifica que existe el bucket "receipts":**
   - Si NO existe, créalo:
     - Click en "New bucket"
     - Nombre: `receipts`
     - ✅ Marca "Public bucket"
     - Click en "Create bucket"

3. **Si ya existe, verifica que sea público:**
   - Click en el bucket "receipts"
   - Click en "Settings" (⚙️)
   - Asegúrate que "Public" esté activado

### Paso 4: Configurar las variables de entorno en Netlify

Para que la función `process-receipt` funcione en producción:

1. **Ve a tu proyecto en Netlify:**
   https://app.netlify.com/sites/[tu-sitio]/settings/deploys

2. **Ve a "Environment variables"**

3. **Agrega estas variables:**
   ```
   OPENAI_API_KEY = [Tu OpenAI API Key - obtén una en https://platform.openai.com/api-keys]
   VITE_SUPABASE_URL = [Tu Supabase URL del archivo .env]
   VITE_SUPABASE_ANON_KEY = [Tu Supabase Anon Key del archivo .env]
   ```

4. **Guarda los cambios**

### Paso 5: Redesplegar en Netlify

Después de hacer los cambios:

```bash
# Opción 1: Push a Git (si usas Git)
git add .
git commit -m "fix: Update receipt scanner configuration"
git push

# Opción 2: Despliegue manual desde Netlify dashboard
# Ve a Deploys → Trigger deploy → Deploy site
```

---

## 🧪 Verificación Final

### 1. Desarrollo Local

```bash
# Inicia el servidor de desarrollo
npm run dev

# Ve a la sección de Receipt Scanner
# Intenta subir una imagen de prueba
```

### 2. Producción

Después del despliegue:
1. Ve a tu sitio en producción
2. Navega a `/app/receipt-scanner`
3. Intenta subir un recibo de prueba
4. Verifica que:
   - ✓ El archivo se sube correctamente
   - ✓ La IA procesa el recibo
   - ✓ Se muestra el modal de revisión
   - ✓ Se puede crear el gasto

---

## 📋 Checklist Completa

- [x] ✅ CSP actualizado para Google Fonts
- [x] ✅ Modelo GPT actualizado a gpt-4o
- [ ] ⏳ Tabla `receipt_uploads` creada en Supabase
- [ ] ⏳ Bucket `receipts` verificado/creado
- [ ] ⏳ Variables de entorno configuradas en Netlify
- [ ] ⏳ Aplicación redespliegada
- [ ] ⏳ Prueba completa del flujo

---

## 🐛 Solución de Problemas

### Error: "receipt_uploads does not exist"
→ No ejecutaste el SQL. Ve al Paso 2.

### Error: "Failed to load resource: net::ERR_NAME_NOT_RESOLVED"
→ La función Netlify no está disponible. Verifica:
1. Que las variables de entorno estén configuradas
2. Que hayas redespliegado después de los cambios
3. Que la función esté en `netlify/functions/process-receipt.ts`

### Error: CSP bloqueando recursos
→ Asegúrate de haber guardado los cambios en `netlify.toml` y redespliegado.

### Error: "OPENAI_API_KEY not configured"
→ Falta configurar las variables de entorno en Netlify (Paso 4).

---

## 📞 Siguiente Paso

**AHORA MISMO:**
1. Abre `check-receipt-db.html` en tu navegador
2. Ve qué falla exactamente
3. Sigue los pasos según los resultados

¡Después de completar todos los pasos, el Receipt Scanner debería funcionar perfectamente! 🎉
