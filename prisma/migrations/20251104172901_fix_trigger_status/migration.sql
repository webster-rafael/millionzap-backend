/*
  Warnings:

  - You are about to drop the column `triggerStatus` on the `conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "triggerStatus" "TriggerStatus" DEFAULT 'WAITING';

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "triggerStatus";
