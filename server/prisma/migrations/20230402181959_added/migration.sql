-- AlterTable
ALTER TABLE "dorm" ALTER COLUMN "dorm_floor" DROP DEFAULT;

-- CreateTable
CREATE TABLE "reservation" (
    "id" SERIAL NOT NULL,
    "laundry_id" INTEGER NOT NULL,
    "washing_device_id" INTEGER NOT NULL,
    "reservation_date" TIMESTAMP(3) NOT NULL,
    "start_hour" TIMESTAMP(3) NOT NULL,
    "end_hour" TIMESTAMP(3) NOT NULL,
    "scheduled_early" BOOLEAN NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_laundry_id_fkey" FOREIGN KEY ("laundry_id") REFERENCES "laundry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_washing_device_id_fkey" FOREIGN KEY ("washing_device_id") REFERENCES "washing_device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
