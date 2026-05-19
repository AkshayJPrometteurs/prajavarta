-- CreateTable
CREATE TABLE `smtp_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `smtp_type` VARCHAR(191) NULL,
    `host` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `secure` VARCHAR(191) NULL,
    `port` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
