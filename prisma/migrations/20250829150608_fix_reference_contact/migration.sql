-- DropForeignKey
ALTER TABLE "contact_list_on_contact" DROP CONSTRAINT "contact_list_on_contact_contactId_fkey";

-- AddForeignKey
ALTER TABLE "contact_list_on_contact" ADD CONSTRAINT "contact_list_on_contact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
