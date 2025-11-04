-- CreateEnum
CREATE TYPE "TriggerStatus" AS ENUM ('WAITING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "triggerStatus" "TriggerStatus" DEFAULT 'WAITING';
