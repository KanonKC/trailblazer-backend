/*
  Warnings:

  - Added the required column `overlay_key` to the `FirstWord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FirstWord" ADD COLUMN     "audio_volume" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "overlay_key" TEXT NOT NULL;
