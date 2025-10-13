/*
  Warnings:

  - You are about to drop the column `instagramProfileId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `instagram_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `instagram_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_instagramProfileId_fkey";

-- AlterTable
ALTER TABLE "instagram_profiles" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "instagramProfileId";

-- CreateIndex
CREATE UNIQUE INDEX "instagram_profiles_userId_key" ON "instagram_profiles"("userId");

-- AddForeignKey
ALTER TABLE "instagram_profiles" ADD CONSTRAINT "instagram_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
