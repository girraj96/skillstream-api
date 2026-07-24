/*
  Warnings:

  - You are about to drop the column `url` on the `PostImage` table. All the data in the column will be lost.
  - Made the column `objectKey` on table `PostImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `PostImage` DROP COLUMN `url`,
    MODIFY `objectKey` VARCHAR(191) NOT NULL;
