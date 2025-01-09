/*
  Warnings:

  - You are about to drop the `CartDetail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_id` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartDetail" DROP CONSTRAINT "CartDetail_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "CartDetail" DROP CONSTRAINT "CartDetail_product_id_fkey";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CartDetail";

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
