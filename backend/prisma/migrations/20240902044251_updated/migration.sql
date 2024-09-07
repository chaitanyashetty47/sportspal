/*
  Warnings:

  - You are about to drop the column `hourlyRate` on the `Turf` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DayType" AS ENUM ('WEEKDAY', 'WEEKEND');

-- AlterTable
ALTER TABLE "Turf" DROP COLUMN "hourlyRate";

-- CreateTable
CREATE TABLE "TurfTiming" (
    "id" TEXT NOT NULL,
    "turfId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TurfTiming_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TurfTiming" ADD CONSTRAINT "TurfTiming_turfId_fkey" FOREIGN KEY ("turfId") REFERENCES "Turf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
