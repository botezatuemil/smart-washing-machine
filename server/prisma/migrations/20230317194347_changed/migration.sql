/*
  Warnings:

  - The values [DRYER_MACHINE] on the enum `device` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "device_new" AS ENUM ('WASHING_MACHINE', 'TUMBLE_DRYER');
ALTER TABLE "washing_device" ALTER COLUMN "type" TYPE "device_new" USING ("type"::text::"device_new");
ALTER TYPE "device" RENAME TO "device_old";
ALTER TYPE "device_new" RENAME TO "device";
DROP TYPE "device_old";
COMMIT;
