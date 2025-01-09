/*
  Warnings:

  - You are about to drop the column `pay_date` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "pay_date";

-- CreateTable
CREATE TABLE "StripePayment" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT,
    "pay_date" TEXT,
    "create_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT,
    "client_secret" TEXT,

    CONSTRAINT "StripePayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripePayment" ADD CONSTRAINT "StripePayment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
