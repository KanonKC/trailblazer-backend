-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FirstWord" (
    "id" TEXT NOT NULL,
    "reply_message" TEXT,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "FirstWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TriggerToWorkflow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TriggerToWorkflow_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "FirstWord_owner_id_key" ON "FirstWord"("owner_id");

-- CreateIndex
CREATE INDEX "_TriggerToWorkflow_B_index" ON "_TriggerToWorkflow"("B");

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FirstWord" ADD CONSTRAINT "FirstWord_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TriggerToWorkflow" ADD CONSTRAINT "_TriggerToWorkflow_A_fkey" FOREIGN KEY ("A") REFERENCES "Trigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TriggerToWorkflow" ADD CONSTRAINT "_TriggerToWorkflow_B_fkey" FOREIGN KEY ("B") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
