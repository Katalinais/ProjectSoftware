/*
  Warnings:

  - Changed the type of `status` on the `Trial` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PRIMERA_INSTANCIA', 'SEGUNDA_INSTANCIA', 'ARCHIVADO');

-- AlterTable
ALTER TABLE "Trial" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;
