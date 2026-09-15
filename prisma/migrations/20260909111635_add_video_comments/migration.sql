-- AlterTable
ALTER TABLE `Video` ADD COLUMN `commentsCount` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `VideoComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `VideoComment_videoId_deletedAt_id_idx`(`videoId`, `deletedAt`, `id`),
    INDEX `VideoComment_userId_deletedAt_createdAt_idx`(`userId`, `deletedAt`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VideoComment` ADD CONSTRAINT `VideoComment_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoComment` ADD CONSTRAINT `VideoComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
