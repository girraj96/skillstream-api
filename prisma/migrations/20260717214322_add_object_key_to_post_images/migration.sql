/*
  Warnings:

  - A unique constraint covering the columns `[objectKey]` on the table `PostImage` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `PostImage` ADD COLUMN `objectKey` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PostImage_objectKey_key` ON `PostImage`(`objectKey`);
