-- AlterTable
ALTER TABLE `Upload` ADD COLUMN `expiresAt` DATETIME(3) NULL,
    MODIFY `status` ENUM('pending', 'uploaded', 'attached', 'expired') NOT NULL DEFAULT 'pending';
