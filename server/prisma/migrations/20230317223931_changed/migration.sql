/*
  Warnings:

  - You are about to drop the column `floor` on the `dorm` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `laundry` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `washing_device` table. All the data in the column will be lost.
  - Added the required column `laundry_floor` to the `laundry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_name` to the `washing_device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dorm" DROP COLUMN "floor",
ADD COLUMN     "dorm_floor" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "laundry" DROP COLUMN "floor",
ADD COLUMN     "laundry_floor" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "washing_device" DROP COLUMN "name",
ADD COLUMN     "device_name" TEXT NOT NULL;
