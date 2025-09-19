/*
  Warnings:

  - You are about to drop the column `userId` on the `todo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "todo" DROP CONSTRAINT "todo_userId_fkey";

-- AlterTable
ALTER TABLE "todo" DROP COLUMN "userId",
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "responsibleId" TEXT;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todo" ADD CONSTRAINT "todo_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
