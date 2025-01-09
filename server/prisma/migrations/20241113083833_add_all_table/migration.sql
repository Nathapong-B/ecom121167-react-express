/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "create_date" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "description" TEXT,
    "stock" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "last_update" TIMESTAMP(3) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "last_update" TIMESTAMP(3) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "image_name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "secure_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_order" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'wait',
    "pay_date" TIMESTAMP(3),
    "tracking_no" TEXT,
    "last_update" TIMESTAMP(3) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDetail" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_orderDetail" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_cart" INTEGER NOT NULL,
    "last_update" TIMESTAMP(3) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartDetail" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartDetail" ADD CONSTRAINT "CartDetail_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
