-- DropForeignKey
ALTER TABLE "RandomDbdPerkClass" DROP CONSTRAINT "RandomDbdPerkClass_random_dbd_perk_id_fkey";

-- AddForeignKey
ALTER TABLE "RandomDbdPerkClass" ADD CONSTRAINT "RandomDbdPerkClass_random_dbd_perk_id_fkey" FOREIGN KEY ("random_dbd_perk_id") REFERENCES "RandomDbdPerk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
