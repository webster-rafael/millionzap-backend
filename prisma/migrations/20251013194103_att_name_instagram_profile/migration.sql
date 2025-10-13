/*
  Warnings:

  - You are about to drop the `InstagramProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_instagramProfileId_fkey";

-- DropTable
DROP TABLE "InstagramProfile";

-- CreateTable
CREATE TABLE "instagram_profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT,
    "followersCount" INTEGER NOT NULL,
    "followsCount" INTEGER NOT NULL,

    CONSTRAINT "instagram_profiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_instagramProfileId_fkey" FOREIGN KEY ("instagramProfileId") REFERENCES "instagram_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
