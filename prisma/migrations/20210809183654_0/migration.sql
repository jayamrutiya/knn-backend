/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogoutAt` on the `user` table. All the data in the column will be lost.
  - Made the column `updatedAt` on table `book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `bookimage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `orderdetail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `subscription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `usercurrentbook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `usersubscription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `usersubscriptionusage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `createdBy` ON `book`;

-- DropIndex
DROP INDEX `bookId` ON `bookcategory`;

-- DropIndex
DROP INDEX `categoryId` ON `bookcategory`;

-- DropIndex
DROP INDEX `bookId` ON `bookimage`;

-- DropIndex
DROP INDEX `bookId` ON `cart`;

-- DropIndex
DROP INDEX `userId` ON `cart`;

-- DropIndex
DROP INDEX `createdBy` ON `category`;

-- DropIndex
DROP INDEX `userId` ON `order`;

-- DropIndex
DROP INDEX `bookId` ON `orderdetail`;

-- DropIndex
DROP INDEX `orderId` ON `orderdetail`;

-- DropIndex
DROP INDEX `userId` ON `refreshtoken`;

-- DropIndex
DROP INDEX `createdBy` ON `role`;

-- DropIndex
DROP INDEX `createdBy` ON `subscription`;

-- DropIndex
DROP INDEX `previousOrderId` ON `userbookexchangelogs`;

-- DropIndex
DROP INDEX `userId` ON `userbookexchangelogs`;

-- DropIndex
DROP INDEX `orderId` ON `usercurrentbook`;

-- DropIndex
DROP INDEX `userId` ON `usercurrentbook`;

-- DropIndex
DROP INDEX `roleId` ON `userrole`;

-- DropIndex
DROP INDEX `userId` ON `userrole`;

-- DropIndex
DROP INDEX `subscriptionId` ON `usersubscription`;

-- DropIndex
DROP INDEX `userId` ON `usersubscription`;

-- DropIndex
DROP INDEX `userSubscriptionId` ON `usersubscriptionusage`;

-- AlterTable
ALTER TABLE `book` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `bookimage` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `cart` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `orderdetail` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `subscription` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `deletedAt`,
    DROP COLUMN `lastLoginAt`,
    DROP COLUMN `lastLogoutAt`,
    MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `usercurrentbook` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `usersubscription` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `usersubscriptionusage` MODIFY `updatedAt` TIMESTAMP NOT NULL;

-- AddForeignKey
ALTER TABLE `Role` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookImage` ADD FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookCategory` ADD FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookCategory` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSubscription` ADD FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSubscription` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSubscriptionUsage` ADD FOREIGN KEY (`userSubscriptionId`) REFERENCES `UserSubscription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCurrentBook` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCurrentBook` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBookExchangeLogs` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBookExchangeLogs` ADD FOREIGN KEY (`previousOrderId`, `latestOrderId`) REFERENCES `Order`(`id`, `id`) ON DELETE CASCADE ON UPDATE CASCADE;
