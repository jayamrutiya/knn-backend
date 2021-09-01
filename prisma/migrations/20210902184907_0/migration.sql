/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `blog` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `book` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `bookimage` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `cart` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `category` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `discussion` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endAt` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `event` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `order` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `orderdetail` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `subscription` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `usercurrentbook` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `usersubscription` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `usersubscriptionusage` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `answer` to the `DiscussionAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `createdBy` ON `blog`;

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
DROP INDEX `categoryId` ON `discussion`;

-- DropIndex
DROP INDEX `createdBy` ON `discussion`;

-- DropIndex
DROP INDEX `answeredBy` ON `discussionanswer`;

-- DropIndex
DROP INDEX `discussionId` ON `discussionanswer`;

-- DropIndex
DROP INDEX `createdBy` ON `event`;

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
DROP INDEX `latestOrderId` ON `userbookexchangelogs`;

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
ALTER TABLE `blog` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `book` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `bookimage` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `cart` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `category` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `discussion` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `discussionanswer` ADD COLUMN `answer` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `event` MODIFY `endAt` DATETIME,
    MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `order` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `orderdetail` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `subscription` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `user` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `usercurrentbook` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `usersubscription` MODIFY `updatedAt` DATETIME;

-- AlterTable
ALTER TABLE `usersubscriptionusage` MODIFY `updatedAt` DATETIME;

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
ALTER TABLE `UserBookExchangeLogs` ADD FOREIGN KEY (`previousOrderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBookExchangeLogs` ADD FOREIGN KEY (`latestOrderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blog` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discussion` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discussion` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionAnswer` ADD FOREIGN KEY (`discussionId`) REFERENCES `Discussion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionAnswer` ADD FOREIGN KEY (`answeredBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
