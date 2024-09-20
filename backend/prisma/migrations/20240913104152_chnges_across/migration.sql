/*
  Warnings:

  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `TurfTiming` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Playground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Playground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hourlyRate` to the `Turf` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TurfType" ADD VALUE 'TENNIS';
ALTER TYPE "TurfType" ADD VALUE 'BASKETBALL';

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "TurfTiming" DROP CONSTRAINT "TurfTiming_turfId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Playground" ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Turf" ADD COLUMN     "hourlyRate" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "TurfTiming";

-- DropEnum
DROP TYPE "DayType";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
