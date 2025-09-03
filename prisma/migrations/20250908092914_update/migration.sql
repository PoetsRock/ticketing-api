/*
  Warnings:

  - The `seatsId` column on the `events` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `venueId` on the `seats` table. All the data in the column will be lost.
  - You are about to drop the `venues` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."seats" DROP CONSTRAINT "seats_venueId_fkey";

-- AlterTable
ALTER TABLE "public"."customers" ADD COLUMN     "seatsOnHold" TEXT[],
ADD COLUMN     "seatsReserved" TEXT[];

-- AlterTable
ALTER TABLE "public"."events" DROP COLUMN "seatsId",
ADD COLUMN     "seatsId" TEXT[];

-- AlterTable
ALTER TABLE "public"."seats" DROP COLUMN "venueId",
ADD COLUMN     "customerId" TEXT;

-- DropTable
DROP TABLE "public"."venues";
