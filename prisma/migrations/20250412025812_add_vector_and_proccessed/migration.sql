-- AlterTable
ALTER TABLE "TodoList" ALTER COLUMN "check" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isProcessed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vectorIndex" TEXT;
