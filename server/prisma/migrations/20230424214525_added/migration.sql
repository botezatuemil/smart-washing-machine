/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `smart_plug` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[washing_device_id]` on the table `smart_plug` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `smart_plug` table without a default value. This is not possible if the table is not empty.
  - Added the required column `washing_device_id` to the `smart_plug` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "laundry" ALTER COLUMN "laundry_name" DROP DEFAULT;

-- AlterTable
ALTER TABLE "smart_plug" ADD COLUMN     "identifier" INTEGER NOT NULL,
ADD COLUMN     "washing_device_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "smart_plug_identifier_key" ON "smart_plug"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "smart_plug_washing_device_id_key" ON "smart_plug"("washing_device_id");

-- AddForeignKey
ALTER TABLE "smart_plug" ADD CONSTRAINT "smart_plug_washing_device_id_fkey" FOREIGN KEY ("washing_device_id") REFERENCES "washing_device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
