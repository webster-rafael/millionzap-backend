/*
  Warnings:

  - Added the required column `message` to the `quick_responses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quick_responses" ADD COLUMN     "message" TEXT NOT NULL;
