/*
  Warnings:

  - Made the column `companyId` on table `contacts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `companyId` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `prompts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `queues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `quick_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `tags` table without a default value. This is not possible if the table is not empty.
  - Made the column `companyId` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_companyId_fkey";

-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "prompts" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "queues" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quick_responses" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "companyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queues" ADD CONSTRAINT "queues_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quick_responses" ADD CONSTRAINT "quick_responses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
