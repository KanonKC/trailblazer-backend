-- CreateTable
CREATE TABLE "ClipShoutout" (
    "id" TEXT NOT NULL,
    "twitch_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "twitch_bot_id" TEXT NOT NULL,
    "reply_message" TEXT,
    "enabled_clip" BOOLEAN NOT NULL DEFAULT true,
    "enabled_highlight_only" BOOLEAN NOT NULL DEFAULT false,
    "overlay_key" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClipShoutout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClipShoutout_twitch_id_key" ON "ClipShoutout"("twitch_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClipShoutout_owner_id_key" ON "ClipShoutout"("owner_id");

-- AddForeignKey
ALTER TABLE "ClipShoutout" ADD CONSTRAINT "ClipShoutout_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
