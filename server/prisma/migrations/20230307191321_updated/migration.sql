/*
  Warnings:

  - You are about to drop the column `name` on the `student` table. All the data in the column will be lost.
  - Added the required column `address_id` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dorm_id` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_number` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "device" AS ENUM ('WASHING_MACHINE', 'DRYER_MACHINE');

-- CreateEnum
CREATE TYPE "maintenance_status" AS ENUM ('BROKEN', 'WORKING', 'UNDER_REPAIR', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "student" DROP COLUMN "name",
ADD COLUMN     "address_id" INTEGER NOT NULL,
ADD COLUMN     "dorm_id" INTEGER NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "registration_number" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "street_number" INTEGER NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dorm" (
    "id" SERIAL NOT NULL,
    "dorm_number" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "building_id" INTEGER NOT NULL,

    CONSTRAINT "dorm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "campus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "building" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "campus_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laundry" (
    "id" SERIAL NOT NULL,
    "building_id" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,

    CONSTRAINT "laundry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "washing_device" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "opened" BOOLEAN NOT NULL,
    "laundry_id" INTEGER NOT NULL,
    "type" "device" NOT NULL,

    CONSTRAINT "washing_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smart_plug" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "smart_plug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "power_consumption" (
    "id" SERIAL NOT NULL,
    "smart_plug_id" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "totalStartTime" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "yesterday" INTEGER NOT NULL,
    "today" INTEGER NOT NULL,
    "power" INTEGER NOT NULL,
    "apparentPower" INTEGER NOT NULL,
    "reactivePower" INTEGER NOT NULL,
    "factor" INTEGER NOT NULL,
    "voltage" INTEGER NOT NULL,
    "current" INTEGER NOT NULL,

    CONSTRAINT "power_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance" (
    "id" SERIAL NOT NULL,
    "washing_device_id" INTEGER NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "lastTimeMaintained" INTEGER NOT NULL,
    "maintenance_status" "maintenance_status" NOT NULL,

    CONSTRAINT "maintenance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_dorm_id_fkey" FOREIGN KEY ("dorm_id") REFERENCES "dorm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dorm" ADD CONSTRAINT "dorm_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building" ADD CONSTRAINT "building_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "building" ADD CONSTRAINT "building_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laundry" ADD CONSTRAINT "laundry_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "building"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "washing_device" ADD CONSTRAINT "washing_device_laundry_id_fkey" FOREIGN KEY ("laundry_id") REFERENCES "laundry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
