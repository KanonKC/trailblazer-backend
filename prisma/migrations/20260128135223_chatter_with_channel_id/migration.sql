/*
  Warnings:

  - Added the required column `twitch_channel_id` to the `FirstWordChatter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FirstWordChatter" ADD COLUMN     "twitch_channel_id" TEXT NOT NULL;
