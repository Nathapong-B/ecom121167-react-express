/*
  Warnings:

  - You are about to drop the column `user_id` on the `ProfileImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileImage" DROP CONSTRAINT "ProfileImage_user_id_fkey";

-- AlterTable
ALTER TABLE "ProfileImage" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileImage_id_fkey" FOREIGN KEY ("profileImage_id") REFERENCES "ProfileImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
