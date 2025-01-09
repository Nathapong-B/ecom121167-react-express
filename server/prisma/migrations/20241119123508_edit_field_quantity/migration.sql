/*
  Warnings:

  - Made the column `quantity` on table `CartDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CartDetail" ALTER COLUMN "quantity" SET NOT NULL;
