/*
  Warnings:

  - You are about to drop the column `category_id` on the `news` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `news` DROP FOREIGN KEY `news_category_id_fkey`;

-- DropIndex
DROP INDEX `news_category_id_fkey` ON `news`;

-- AlterTable
ALTER TABLE `news` DROP COLUMN `category_id`,
    ADD COLUMN `categoryId` INTEGER NULL,
    ADD COLUMN `category_ids` VARCHAR(191) NULL,
    ADD COLUMN `is_breaking_news` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_mini_trending_news` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_trending_news` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `video_id` VARCHAR(191) NULL,
    ADD COLUMN `video_url` VARCHAR(191) NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `news_gallery_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `news_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `news_gallery_images_news_id_fkey`(`news_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_gallery_images` ADD CONSTRAINT `news_gallery_images_news_id_fkey` FOREIGN KEY (`news_id`) REFERENCES `news`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
