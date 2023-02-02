/*
  Warnings:

  - You are about to drop the column `userId` on the `Card` table. All the data in the column will be lost.
  - Added the required column `userName` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_userId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userName_fkey" FOREIGN KEY ("userName") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
