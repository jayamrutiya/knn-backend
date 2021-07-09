/*
  Warnings:

  - You are about to alter the column `updatedAt` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `bookimage` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `cart` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `category` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `orderdetail` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `subscription` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `lastLoginAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `lastLogoutAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `deletedAt` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `usercurrentbook` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `usersubscription` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `usersubscriptionusage` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropIndex
DROP INDEX `roleId` ON `userrole`;

-- DropIndex
DROP INDEX `userId` ON `cart`;

-- DropIndex
DROP INDEX `createdBy` ON `category`;

-- DropIndex
DROP INDEX `createdBy` ON `role`;

-- DropIndex
DROP INDEX `createdBy` ON `subscription`;

-- DropIndex
DROP INDEX `bookId` ON `bookcategory`;

-- DropIndex
DROP INDEX `userId` ON `refreshtoken`;

-- DropIndex
DROP INDEX `categoryId` ON `bookcategory`;

-- DropIndex
DROP INDEX `orderId` ON `usercurrentbook`;

-- DropIndex
DROP INDEX `userId` ON `order`;

-- DropIndex
DROP INDEX `userId` ON `usercurrentbook`;

-- DropIndex
DROP INDEX `createdBy` ON `book`;

-- DropIndex
DROP INDEX `userId` ON `userrole`;

-- DropIndex
DROP INDEX `userId` ON `usersubscription`;

-- DropIndex
DROP INDEX `userSubscriptionId` ON `usersubscriptionusage`;

-- DropIndex
DROP INDEX `orderId` ON `orderdetail`;

-- DropIndex
DROP INDEX `bookId` ON `cart`;

-- DropIndex
DROP INDEX `bookId` ON `orderdetail`;

-- DropIndex
DROP INDEX `subscriptionId` ON `usersubscription`;

-- DropIndex
DROP INDEX `bookId` ON `bookimage`;

-- AlterTable
ALTER TABLE `book` MODIFY `updatedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `bookimage` MODIFY `updatedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `cart` MODIFY `updatedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `category` MODIFY `updatedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `order` MODIFY `updatedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `orderdetail` MODIFY `updatedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `subscription` MODIFY `updatedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `user` MODIFY `lastLoginAt` TIMESTAMP,
    MODIFY `lastLogoutAt` TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP,
    MODIFY `deletedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `usercurrentbook` MODIFY `updatedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `usersubscription` MODIFY `updatedAt` TIMESTAMP;

-- AlterTable
ALTER TABLE `usersubscriptionusage` MODIFY `updatedAt` TIMESTAMP;

-- AddForeignKey
ALTER TABLE `Book` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookCategory` ADD FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookCategory` ADD FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookImage` ADD FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCurrentBook` ADD FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCurrentBook` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSubscription` ADD FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSubscription` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSubscriptionUsage` ADD FOREIGN KEY (`userSubscriptionId`) REFERENCES `UserSubscription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
