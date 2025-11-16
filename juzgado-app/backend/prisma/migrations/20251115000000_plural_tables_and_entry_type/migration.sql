-- Crear tabla entry_types primero
CREATE TABLE "entry_types" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "entry_types_pkey" PRIMARY KEY ("id")
);

-- Insertar los tipos de entrada por defecto
INSERT INTO "entry_types" ("id", "description") VALUES
(gen_random_uuid()::text, 'Por Reparto'),
(gen_random_uuid()::text, 'Reingreso'),
(gen_random_uuid()::text, 'Recibido de Otros Despachos'),
(gen_random_uuid()::text, 'Competencia'),
(gen_random_uuid()::text, 'Impedimento'),
(gen_random_uuid()::text, 'Otras Entradas No Efectivas');

-- Renombrar tablas a plural
ALTER TABLE "Person" RENAME TO "people";
ALTER TABLE "TypeTrial" RENAME TO "type_trials";
ALTER TABLE "Category" RENAME TO "categories";
ALTER TABLE "TypeAction" RENAME TO "type_actions";
ALTER TABLE "DescriptionAction" RENAME TO "description_actions";
ALTER TABLE "Action" RENAME TO "actions";
ALTER TABLE "Trial" RENAME TO "trials";
ALTER TABLE "User" RENAME TO "users";

-- Actualizar los entryTypeId en trials para que apunten a los IDs de entry_types
-- Mapear los valores de string a los IDs de entry_types
DO $$
DECLARE
    por_reparto_id TEXT;
    reingreso_id TEXT;
    recibido_id TEXT;
    competencia_id TEXT;
    impedimento_id TEXT;
    otras_id TEXT;
BEGIN
    -- Obtener los IDs de entry_types
    SELECT id INTO por_reparto_id FROM "entry_types" WHERE description = 'Por Reparto' LIMIT 1;
    SELECT id INTO reingreso_id FROM "entry_types" WHERE description = 'Reingreso' LIMIT 1;
    SELECT id INTO recibido_id FROM "entry_types" WHERE description = 'Recibido de Otros Despachos' LIMIT 1;
    SELECT id INTO competencia_id FROM "entry_types" WHERE description = 'Competencia' LIMIT 1;
    SELECT id INTO impedimento_id FROM "entry_types" WHERE description = 'Impedimento' LIMIT 1;
    SELECT id INTO otras_id FROM "entry_types" WHERE description = 'Otras Entradas No Efectivas' LIMIT 1;

    -- Actualizar los valores en trials
    UPDATE "trials" SET "entryTypeId" = por_reparto_id WHERE "entryTypeId" = 'POR_REPARTO';
    UPDATE "trials" SET "entryTypeId" = reingreso_id WHERE "entryTypeId" = 'REINGRESO';
    UPDATE "trials" SET "entryTypeId" = recibido_id WHERE "entryTypeId" = 'RECIBIDO_OTROS_DESPACHOS';
    UPDATE "trials" SET "entryTypeId" = competencia_id WHERE "entryTypeId" = 'COMPETENCIA';
    UPDATE "trials" SET "entryTypeId" = impedimento_id WHERE "entryTypeId" = 'IMPEDIMENTO';
    UPDATE "trials" SET "entryTypeId" = otras_id WHERE "entryTypeId" = 'OTRAS_ENTRADAS_NO_EFECTIVAS';
END $$;

-- Agregar foreign key constraint
ALTER TABLE "trials" 
ADD CONSTRAINT "trials_entryTypeId_fkey" 
FOREIGN KEY ("entryTypeId") REFERENCES "entry_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

