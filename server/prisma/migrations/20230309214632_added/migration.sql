/*
  Warnings:

  - A unique constraint covering the columns `[student_id]` on the table `washing_device` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `student_id` to the `washing_device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "washing_device" ADD COLUMN     "student_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "washing_device_student_id_key" ON "washing_device"("student_id");

-- AddForeignKey
ALTER TABLE "washing_device" ADD CONSTRAINT "washing_device_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
