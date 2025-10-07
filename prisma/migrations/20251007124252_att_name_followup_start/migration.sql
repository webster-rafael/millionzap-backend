/*
  Warnings:

  - You are about to drop the column `FollowUpStart` on the `conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "FollowUpStart",
ADD COLUMN     "followUpStart" TIMESTAMP(3);
