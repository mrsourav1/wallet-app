/*
  Warnings:

  - You are about to drop the column `transactionType` on the `Ledger` table. All the data in the column will be lost.
  - Added the required column `type` to the `Ledger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ledger" DROP COLUMN "transactionType",
ADD COLUMN     "type" TEXT NOT NULL;
