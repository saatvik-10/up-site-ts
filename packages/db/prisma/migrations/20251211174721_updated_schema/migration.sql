/*
  Warnings:

  - You are about to drop the column `createdAt` on the `website_tick` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "website_tick" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
