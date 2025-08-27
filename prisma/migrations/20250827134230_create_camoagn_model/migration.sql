-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "title" TEXT,
    "imageUrl" TEXT,
    "footer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactListId" TEXT NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_contactListId_key" ON "campaigns"("contactListId");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_contactListId_fkey" FOREIGN KEY ("contactListId") REFERENCES "contact_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
