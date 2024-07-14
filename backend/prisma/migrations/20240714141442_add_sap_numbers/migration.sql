/*
  Warnings:

  - Added the required column `sapNumber` to the `ProductSize` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductSize" ADD COLUMN     "sapNumber" TEXT NOT NULL;
