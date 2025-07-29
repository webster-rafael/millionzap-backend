/*
  Warnings:

  - Made the column `companyResume` on table `prompts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "prompts" ALTER COLUMN "companyResume" SET NOT NULL;
