-- AlterTable
ALTER TABLE "description_actions" ADD COLUMN "typeTrialId" TEXT;

-- AddForeignKey
ALTER TABLE "description_actions" ADD CONSTRAINT "description_actions_typeTrialId_fkey" FOREIGN KEY ("typeTrialId") REFERENCES "type_trials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

