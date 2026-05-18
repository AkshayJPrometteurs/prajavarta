-- AlterTable
ALTER TABLE `users` ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `designation` VARCHAR(191) NULL,
    ADD COLUMN `experience` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `linkedin` VARCHAR(191) NULL,
    ADD COLUMN `name_english` VARCHAR(191) NULL,
    ADD COLUMN `twitter` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL;
