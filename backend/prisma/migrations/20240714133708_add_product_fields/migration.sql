/*
  Warnings:

  - A unique constraint covering the columns `[itemNumber]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemNumber` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "itemNumber" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_itemNumber_key" ON "Product"("itemNumber");
