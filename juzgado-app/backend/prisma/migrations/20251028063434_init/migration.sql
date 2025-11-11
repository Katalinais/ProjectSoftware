-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('POR_REPARTO', 'REINGRESO', 'RECIBIDO_OTROS_DESPACHOS', 'COMPETENCIA', 'IMPEDIMENTO', 'OTRAS_ENTRADAS_NO_EFECTIVAS');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('AUTO', 'SENTENCIA');

-- CreateEnum
CREATE TYPE "GuardianShipType" AS ENUM ('SALUD', 'SEGURIDAD_SOCIAL', 'VIDA', 'MINIMO_VITAL', 'IGUALDAD', 'EDUCACION', 'DEBIDO_PROCESO', 'PETICION', 'INFORMACION_PUBLICA', 'CONTRA_PROVIDENCIAS_JUDICIALES', 'MEDIO_AMBIENTE', 'OTROS');

-- CreateEnum
CREATE TYPE "HabeasCorpusType" AS ENUM ('LIBERTAD', 'OTROS');

-- CreateEnum
CREATE TYPE "LaborType" AS ENUM ('ORDINARIOS_SEGURIDAD_SOCIAL', 'ORDINARIOS_CONTRATOS_TRABAJO', 'ORDINARIOS_RECONOCIMIENTO_HONORARIOS', 'ORDINARIOS_OTROS', 'EJECUTIVOS_SEGURIDAD_SOCIAL', 'EJECUTIVOS_CONTRATO_TRABAJO', 'EJECUTIVOS_APORTES_PARAFISCALES', 'EJECUTIVOS_OTROS', 'CONCILIACION_EXTRAJUDICIAL', 'PAGOS_POR_CONSIGNACION', 'OTROS');

-- CreateEnum
CREATE TYPE "TypeTrial" AS ENUM ('LABORAL', 'TUTELA', 'INCIDENTE_DE_DESACATO', 'HABEAS_CORPUS');

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TypeTrial" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeAction" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TypeAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DescriptionAction" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "typeActionId" TEXT NOT NULL,

    CONSTRAINT "DescriptionAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "descriptionActionId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "trialId" TEXT,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trial" (
    "id" TEXT NOT NULL,
    "plaintiffId" TEXT NOT NULL,
    "defendantId" TEXT NOT NULL,
    "typeTrial" "TypeTrial" NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "closeDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "entryType" "EntryType" NOT NULL,

    CONSTRAINT "Trial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DescriptionAction" ADD CONSTRAINT "DescriptionAction_typeActionId_fkey" FOREIGN KEY ("typeActionId") REFERENCES "TypeAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_descriptionActionId_fkey" FOREIGN KEY ("descriptionActionId") REFERENCES "DescriptionAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "Trial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trial" ADD CONSTRAINT "Trial_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trial" ADD CONSTRAINT "Trial_plaintiffId_fkey" FOREIGN KEY ("plaintiffId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trial" ADD CONSTRAINT "Trial_defendantId_fkey" FOREIGN KEY ("defendantId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
