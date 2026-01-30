-- DropForeignKey
ALTER TABLE "FirstWordChatter" DROP CONSTRAINT "FirstWordChatter_first_word_id_fkey";

-- AddForeignKey
ALTER TABLE "FirstWordChatter" ADD CONSTRAINT "FirstWordChatter_first_word_id_fkey" FOREIGN KEY ("first_word_id") REFERENCES "FirstWord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
