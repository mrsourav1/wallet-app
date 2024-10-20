/*
  Warnings:

  - Changed the type of `transactionType` on the `OnRampTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "transType" AS ENUM ('deposite', 'withdraw');

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "transactionType",
ADD COLUMN     "transactionType" "transType" NOT NULL;
