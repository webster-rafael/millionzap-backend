/*
  Warnings:

  - Added the required column `companyId` to the `contact_list` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contact_list" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "contact_list" ADD CONSTRAINT "contact_list_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
