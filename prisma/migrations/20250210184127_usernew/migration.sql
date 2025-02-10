/*
  Warnings:

  - You are about to drop the column `isActivated` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActivated",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
