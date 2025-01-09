/*
  Warnings:

  - You are about to drop the column `product_id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_product_id_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "product_id",
DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "CartDetail" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cart_id" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
