/*
  Warnings:

  - You are about to drop the column `desc` on the `Project` table. All the data in the column will be lost.
  - Added the required column `client` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technologies` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "desc",
ADD COLUMN     "client" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "industry" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER,
ADD COLUMN     "technologies" TEXT NOT NULL;
