/*
  Warnings:

  - Added the required column `timestamp` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MessageStatus" ADD VALUE 'RECEIVED';

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "timestamp" TEXT NOT NULL;
