/*
  Warnings:

  - You are about to drop the column `type` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `typeTrial` on the `Trial` table. All the data in the column will be lost.
  - Added the required column `typeTrialId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeTrialId` to the `Trial` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeTrialEnum" AS ENUM ('LABORAL', 'TUTELA', 'INCIDENTE_DE_DESACATO', 'HABEAS_CORPUS');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "type",
ADD COLUMN     "typeTrialId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trial" DROP COLUMN "typeTrial",
ADD COLUMN     "typeTrialId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."TypeTrial";

-- CreateTable
CREATE TABLE "TypeTrial" (
    "id" TEXT NOT NULL,
    "name" "TypeTrialEnum" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TypeTrial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_typeTrialId_fkey" FOREIGN KEY ("typeTrialId") REFERENCES "TypeTrial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trial" ADD CONSTRAINT "Trial_typeTrialId_fkey" FOREIGN KEY ("typeTrialId") REFERENCES "TypeTrial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
