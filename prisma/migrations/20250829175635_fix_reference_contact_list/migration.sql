-- DropForeignKey
ALTER TABLE "contact_list_on_contact" DROP CONSTRAINT "contact_list_on_contact_contactListId_fkey";

-- AddForeignKey
ALTER TABLE "contact_list_on_contact" ADD CONSTRAINT "contact_list_on_contact_contactListId_fkey" FOREIGN KEY ("contactListId") REFERENCES "contact_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
