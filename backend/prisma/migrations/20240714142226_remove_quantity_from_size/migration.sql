/*
  Warnings:

  - You are about to drop the column `quantity` on the `ProductSize` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductSize" DROP COLUMN "quantity",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
