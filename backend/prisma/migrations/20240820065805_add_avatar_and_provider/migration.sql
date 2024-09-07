-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "provider" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
