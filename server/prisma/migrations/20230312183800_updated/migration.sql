/*
  Warnings:

  - Added the required column `password` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "washing_device_student_id_key";

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "password" TEXT NOT NULL;
