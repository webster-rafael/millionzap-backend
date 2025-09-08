/*
  Warnings:

  - You are about to drop the column `createcreatedAt` on the `conversation_ig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "conversation_ig" DROP COLUMN "createcreatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
