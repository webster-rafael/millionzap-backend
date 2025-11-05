-- AlterTable
ALTER TABLE "prompts" ADD COLUMN     "isIgCommentPrompt" BOOLEAN DEFAULT false,
ADD COLUMN     "isIgDMsPrompt" BOOLEAN DEFAULT false;
