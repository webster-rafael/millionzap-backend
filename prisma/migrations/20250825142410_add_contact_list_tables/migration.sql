-- CreateTable
CREATE TABLE "contact_list" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_list_on_contact" (
    "contactId" TEXT NOT NULL,
    "contactListId" TEXT NOT NULL,

    CONSTRAINT "contact_list_on_contact_pkey" PRIMARY KEY ("contactId","contactListId")
);

-- AddForeignKey
ALTER TABLE "contact_list_on_contact" ADD CONSTRAINT "contact_list_on_contact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_list_on_contact" ADD CONSTRAINT "contact_list_on_contact_contactListId_fkey" FOREIGN KEY ("contactListId") REFERENCES "contact_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
