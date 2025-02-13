-- CreateTable
CREATE TABLE "HistoryChat" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "setor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoryChat_pkey" PRIMARY KEY ("id")
);
