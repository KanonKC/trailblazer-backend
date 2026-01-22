import { twitchAppAPI } from "@/libs/twurple";
import WorkflowRepository from "@/repositories/workflow/workflow.repository";
import { Workflow } from "generated/prisma/client";

export default class WorkflowService {
    private workflowRepository: WorkflowRepository
    constructor(workflowRepository: WorkflowRepository) {
        this.workflowRepository = workflowRepository
    }

    async publish(id: string) {
        const owner = await this.workflowRepository.getOwner(id)
        if (!owner) {
            throw new Error("Workflow not found")
        }
        const eventSub = await twitchAppAPI.eventSub.subscribeToChannelChatMessageEvents(owner.twitch_id, {
            method: "webhook",
            callback: "https://blaze-dev.kanonkc.com/webhook/v1/twitch/event-sub/chat-message-events",
            secret: "8chkr2187r3y6ppl57pspl5hjea2v0"
        })
        console.log(eventSub)
    }

    async execute(workflow: Workflow) {

    }
}