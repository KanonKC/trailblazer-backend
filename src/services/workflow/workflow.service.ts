import { createESTransport, twitchAppAPI } from "@/libs/twurple";
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
        const tsp = createESTransport("/webhook/v1/twitch/event-sub/chat-message-events")
        const eventSub = await twitchAppAPI.eventSub.subscribeToChannelChatMessageEvents(owner.twitch_id, tsp)
    }

    async execute(workflow: Workflow) {

    }
}