/*
  Warnings:

  - You are about to drop the column `aviable` on the `Product` table. All the data in the column will be lost.
  - Added the required column `avaiable` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "aviable",
ADD COLUMN     "avaiable" BOOLEAN NOT NULL;
