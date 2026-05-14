-- AlterTable
ALTER TABLE `news` ADD COLUMN `location_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `news_location_id_fkey` ON `news`(`location_id`);

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
