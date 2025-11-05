/*
  Warnings:

  - Made the column `status` on table `conversation_ig` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversation_ig" ALTER COLUMN "status" SET NOT NULL;
