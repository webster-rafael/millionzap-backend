-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_contactId_fkey";

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
