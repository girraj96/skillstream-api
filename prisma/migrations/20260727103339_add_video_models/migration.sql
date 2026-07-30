-- CreateTable
CREATE TABLE `Video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('pending', 'processing', 'ready', 'failed') NOT NULL DEFAULT 'pending',
    `visibility` ENUM('public', 'private') NOT NULL DEFAULT 'private',
    `originalObjectKey` VARCHAR(191) NOT NULL,
    `thumbnailObjectKey` VARCHAR(191) NULL,
    `durationSeconds` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Video_originalObjectKey_key`(`originalObjectKey`),
    UNIQUE INDEX `Video_thumbnailObjectKey_key`(`thumbnailObjectKey`),
    INDEX `Video_authorId_deletedAt_createdAt_idx`(`authorId`, `deletedAt`, `createdAt`),
    INDEX `Video_visibility_status_deletedAt_createdAt_idx`(`visibility`, `status`, `deletedAt`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoRendition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `videoId` INTEGER NOT NULL,
    `quality` ENUM('original', 'p720', 'p480', 'p360') NOT NULL,
    `objectKey` VARCHAR(191) NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `bitrate` INTEGER NULL,
    `sizeBytes` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VideoRendition_objectKey_key`(`objectKey`),
    INDEX `VideoRendition_videoId_idx`(`videoId`),
    UNIQUE INDEX `VideoRendition_videoId_quality_key`(`videoId`, `quality`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoRendition` ADD CONSTRAINT `VideoRendition_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
