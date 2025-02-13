-- CreateTable
CREATE TABLE "UserSession" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "lastStep" INTEGER,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_number_key" ON "UserSession"("number");
