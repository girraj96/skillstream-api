-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `commentId` INTEGER NULL,
    ADD COLUMN `videoId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Notification_videoId_createdAt_idx` ON `Notification`(`videoId`, `createdAt`);

-- CreateIndex
CREATE INDEX `Notification_commentId_idx` ON `Notification`(`commentId`);
