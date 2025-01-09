/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id]` on the table `CartDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cart_id]` on the table `CartDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id]` on the table `OrderDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `OrderDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[category_id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_id_key" ON "Cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "CartDetail_product_id_key" ON "CartDetail"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "CartDetail_cart_id_key" ON "CartDetail"("cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "OrderDetail_product_id_key" ON "OrderDetail"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "OrderDetail_order_id_key" ON "OrderDetail"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_id_key" ON "Product"("category_id");
