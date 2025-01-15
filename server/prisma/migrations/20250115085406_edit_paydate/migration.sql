/*
  Warnings:

  - You are about to drop the column `test_paydate` on the `StripePayment` table. All the data in the column will be lost.
  - The `pay_date` column on the `StripePayment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StripePayment" DROP COLUMN "test_paydate",
DROP COLUMN "pay_date",
ADD COLUMN     "pay_date" TIMESTAMP(3);
