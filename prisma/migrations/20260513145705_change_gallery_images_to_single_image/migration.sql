/*
  Warnings:

  - You are about to drop the column `gallery_images` on the `news` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `news` DROP COLUMN `gallery_images`,
    ADD COLUMN `gallery_image` VARCHAR(191) NULL;
