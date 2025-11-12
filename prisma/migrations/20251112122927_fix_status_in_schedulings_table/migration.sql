/*
  Warnings:

  - Changed the type of `status` on the `scheduling` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusScheduling" AS ENUM ('SCHEDULING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- AlterTable
ALTER TABLE "scheduling" DROP COLUMN "status",
ADD COLUMN     "status" "StatusScheduling" NOT NULL;
