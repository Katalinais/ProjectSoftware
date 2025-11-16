-- DropForeignKey
ALTER TABLE "trials" DROP CONSTRAINT IF EXISTS "Trial_categoryId_fkey";

-- AlterTable
ALTER TABLE "trials" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "trials" ADD CONSTRAINT "trials_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

