/*
  Warnings:

  - You are about to drop the column `notificationId` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student" DROP COLUMN "notificationId",
ADD COLUMN     "notification_token" TEXT NOT NULL DEFAULT '123';
