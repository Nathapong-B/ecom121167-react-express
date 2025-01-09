/*
  Warnings:

  - Added the required column `customer_address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customer_address" TEXT NOT NULL,
ADD COLUMN     "customer_name" TEXT NOT NULL,
ADD COLUMN     "customer_phone" TEXT NOT NULL;
