-- Crear tipos ENUM para status y priority
CREATE TYPE status AS ENUM ('active', 'inactive');
CREATE TYPE sex as ENUM ('m', 'f', 'u');

-- Crear la tabla wines
CREATE TABLE wines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  house TEXT NOT NULL,
  variety TEXT NOT NULL,
  year INT,
  color TEXT,
  country TEXT,
  region TEXT,
  price NUMERIC(10,2) NOT NULL,
  status status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  image TEXT
);

-- Crear índices para mejorar el rendimiento de consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_wines_status_country_color
ON wines(status, country, color);

ALTER TABLE wines ENABLE ROW LEVEL SECURITY;

-- Políticas para tabla wines: lectura pública, escritura solo autenticados
CREATE POLICY "Anyone can read wines"
ON wines
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert wines"
ON wines
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update wines"
ON wines
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete wines"
ON wines
FOR DELETE
TO authenticated
USING (true);

-- =============== BUCKET PARA IMAGENES DE TAREAS ===============

-- Insertar nuevo bucket para imágenes de tareas
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'wines-images',
  'wines-images',
  true, -- Público: cualquiera puede ver archivos
  false,
  2524288, -- 2.5MB límite por archivo
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Política para subir archivos: Solo el dueño puede subir
CREATE POLICY "Auth users can upload wine images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para ver archivos: cualquiera puede ver
CREATE POLICY "Anyone can view wine images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'wines-images');

-- Política para actualizar: cualquier usuario autenticado
CREATE POLICY "Auth users can update wine images"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (true);

-- Política para eliminar: cualquier usuario autenticado
CREATE POLICY "Auth users can delete wine images"
ON storage.objects
FOR DELETE
TO authenticated
WITH CHECK (true);

-- =============== TABLA MERCH ===============

-- Crear la tabla merch basada en merchdb.json
CREATE TABLE IF NOT EXISTS merch (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  variety TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image TEXT,
  status status DEFAULT 'active',
  sex sex DEFAULT 'm',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para filtros frecuentes en merch
CREATE INDEX IF NOT EXISTS idx_merch_status_variety_sex
ON merch(status, variety, sex);

CREATE INDEX IF NOT EXISTS idx_merch_name
ON merch(name);

ALTER TABLE merch ENABLE ROW LEVEL SECURITY;

-- Políticas para tabla merch: lectura pública, escritura solo autenticados
CREATE POLICY "Anyone can read merch"
ON merch
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert merch"
ON merch
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update merch"
ON merch
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete merch"
ON merch
FOR DELETE
TO authenticated
USING (true);

-- =============== BUCKET PARA IMAGENES DE MERCH ===============

INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'merch-images',
  'merch-images',
  true,
  false,
  2524288,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Política para subir archivos: Cualquier usuario autenticado puede subir, pero solo a su carpeta
CREATE POLICY "Auth users can upload merch images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Ver archivos: público
CREATE POLICY "Anyone can view merch images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'merch-images');

-- Actualizar archivos: cualquier usuario autenticado
CREATE POLICY "Auth users can update merch images"
ON storage.objects
FOR UPDATE
TO authenticated
WITH CHECK (true);

-- Eliminar archivos: cualquier usuario autenticado
CREATE POLICY "Auth users can delete merch images"
ON storage.objects
FOR DELETE
TO authenticated
WITH CHECK (true);