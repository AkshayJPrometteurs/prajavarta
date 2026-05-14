/*
  Warnings:

  - You are about to drop the column `sort_order` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `subdivisions` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `tehsils` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `districts` DROP COLUMN `sort_order`;

-- AlterTable
ALTER TABLE `subdivisions` DROP COLUMN `sort_order`;

-- AlterTable
ALTER TABLE `tehsils` DROP COLUMN `sort_order`;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `name_english` VARCHAR(191) NULL,
    `district_id` INTEGER NULL,
    `subdivision_id` INTEGER NULL,
    `group_link` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_subdivision_id_fkey` FOREIGN KEY (`subdivision_id`) REFERENCES `subdivisions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
