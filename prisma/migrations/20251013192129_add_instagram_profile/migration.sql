-- AlterTable
ALTER TABLE "users" ADD COLUMN     "instagramProfileId" TEXT;

-- CreateTable
CREATE TABLE "InstagramProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT,
    "followersCount" INTEGER NOT NULL,
    "followsCount" INTEGER NOT NULL,

    CONSTRAINT "InstagramProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_instagramProfileId_fkey" FOREIGN KEY ("instagramProfileId") REFERENCES "InstagramProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
