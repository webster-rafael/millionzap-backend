-- CreateTable
CREATE TABLE "configurations" (
    "id" TEXT NOT NULL,
    "followupTimeInHours" INTEGER NOT NULL DEFAULT 72,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configurations_companyId_key" ON "configurations"("companyId");

-- AddForeignKey
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
