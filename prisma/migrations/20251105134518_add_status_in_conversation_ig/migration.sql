-- CreateEnum
CREATE TYPE "ConversationIgStatus" AS ENUM ('WAITING', 'SERVING');

-- AlterTable
ALTER TABLE "conversation_ig" ADD COLUMN     "status" "ConversationIgStatus" DEFAULT 'WAITING';
