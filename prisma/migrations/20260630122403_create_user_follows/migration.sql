-- CreateTable
CREATE TABLE `UserFollow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `followerId` INTEGER NOT NULL,
    `followingId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserFollow_followerId_createdAt_idx`(`followerId`, `createdAt`),
    INDEX `UserFollow_followingId_createdAt_idx`(`followingId`, `createdAt`),
    UNIQUE INDEX `UserFollow_followerId_followingId_key`(`followerId`, `followingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserFollow` ADD CONSTRAINT `UserFollow_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserFollow` ADD CONSTRAINT `UserFollow_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
