/*
  Warnings:

  - You are about to drop the column `customer_address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customer_phone` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customer_address",
DROP COLUMN "customer_name",
DROP COLUMN "customer_phone";
