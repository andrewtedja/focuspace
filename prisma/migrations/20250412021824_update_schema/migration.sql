-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bg" TEXT,
ADD COLUMN     "bgUuid" TEXT,
ADD COLUMN     "file" TEXT,
ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileUuid" TEXT,
ADD COLUMN     "imageUuid" TEXT,
ADD COLUMN     "music" TEXT,
ADD COLUMN     "musicName" TEXT,
ADD COLUMN     "musicUuid" TEXT;

-- CreateTable
CREATE TABLE "TodoList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "check" BOOLEAN NOT NULL,

    CONSTRAINT "TodoList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TodoList" ADD CONSTRAINT "TodoList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
