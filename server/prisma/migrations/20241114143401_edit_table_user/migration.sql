/*
  Warnings:

  - You are about to drop the column `user_name` on the `User` table. All the data in the column will be lost.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_user_name_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "user_name",
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL;
