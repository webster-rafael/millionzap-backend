/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `instagram_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "instagram_profiles" ADD COLUMN     "companyId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "instagram_profiles_companyId_key" ON "instagram_profiles"("companyId");

-- AddForeignKey
ALTER TABLE "instagram_profiles" ADD CONSTRAINT "instagram_profiles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
