/*
  Warnings:

  - You are about to drop the `authors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `author_followers` DROP FOREIGN KEY `author_followers_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `news` DROP FOREIGN KEY `news_author_id_fkey`;

-- DropIndex
DROP INDEX `author_followers_author_id_fkey` ON `author_followers`;

-- DropTable
DROP TABLE `authors`;
