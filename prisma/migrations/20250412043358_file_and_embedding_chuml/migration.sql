/*
  Warnings:

  - You are about to drop the column `file` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fileUuid` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isProcessed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vectorIndex` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "file",
DROP COLUMN "fileName",
DROP COLUMN "fileUuid",
DROP COLUMN "isProcessed",
DROP COLUMN "vectorIndex";

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUuid" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "vectorIndex" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbeddingChunk" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "chunk" TEXT NOT NULL,
    "vector" JSONB NOT NULL,

    CONSTRAINT "EmbeddingChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbeddingChunk" ADD CONSTRAINT "EmbeddingChunk_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
