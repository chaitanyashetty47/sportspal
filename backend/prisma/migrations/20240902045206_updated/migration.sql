/*
  Warnings:

  - Changed the type of `day` on the `TurfTiming` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TurfTiming" DROP COLUMN "day",
ADD COLUMN     "day" "DayType" NOT NULL;
