-- AlterTable
ALTER TABLE `Video` ADD COLUMN `likesCount` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `VideoLike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VideoLike_videoId_createdAt_idx`(`videoId`, `createdAt`),
    INDEX `VideoLike_userId_createdAt_idx`(`userId`, `createdAt`),
    UNIQUE INDEX `VideoLike_videoId_userId_key`(`videoId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VideoLike` ADD CONSTRAINT `VideoLike_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoLike` ADD CONSTRAINT `VideoLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
