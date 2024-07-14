/*
  Warnings:

  - You are about to drop the column `itemNumber` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSize` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSize" DROP CONSTRAINT "ProductSize_productId_fkey";

-- DropIndex
DROP INDEX "Product_itemNumber_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "itemNumber";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "ProductSize";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Size" (
    "id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,
    "sapNumber" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
