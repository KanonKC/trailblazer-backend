-- AlterTable
ALTER TABLE "FirstWord" ADD COLUMN     "twitch_bot_id" TEXT;

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "twitch_refresh_token" TEXT,
    "twitch_token_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_user_id_key" ON "Auth"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_twitch_refresh_token_key" ON "Auth"("twitch_refresh_token");

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
