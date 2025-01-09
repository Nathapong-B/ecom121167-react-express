/*
  Warnings:

  - You are about to drop the column `receipt_url` on the `StripePayment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripePayment" DROP COLUMN "receipt_url";
