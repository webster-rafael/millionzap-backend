-- CreateTable
CREATE TABLE "scheduling" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" INTEGER,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "companyId" TEXT,
    "contactId" TEXT NOT NULL,
    "reminder" BOOLEAN NOT NULL DEFAULT false,
    "reminderTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduling_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
