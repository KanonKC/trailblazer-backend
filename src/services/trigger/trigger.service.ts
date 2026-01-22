import { CreateTriggerRequest } from "@/repositories/trigger/request";
import TriggerRepository from "@/repositories/trigger/trigger.repository";
import WorkflowRepository from "@/repositories/workflow/workflow.repository";
import { Trigger } from "generated/prisma/client";
import WorkflowService from "../workflow/workflow.service";
import UserService from "../user/user.service";
import UserRepository from "@/repositories/user/user.repository";
import { CreateByTwitchEventSubRequest } from "./request";

export default class TriggerService {
    private readonly triggerRepository: TriggerRepository
    private readonly workflowRepository: WorkflowRepository
    private readonly workflowService: WorkflowService
    private readonly userRepository: UserRepository

    constructor(triggerRepository: TriggerRepository, workflowRepository: WorkflowRepository, workflowService: WorkflowService, userRepository: UserRepository) {
        this.triggerRepository = triggerRepository
        this.workflowRepository = workflowRepository
        this.workflowService = workflowService
        this.userRepository = userRepository
    }

    async createByTwitchEventSub(e: any): Promise<Trigger> {
        const user = await this.userRepository.getByTwitchId(e.subscription.condition.broadcaster_user_id)
        if (!user) {
            throw new Error("User not found")
        }
        const cr: CreateTriggerRequest = {
            id: e.subscription.id,
            type: e.subscription.type,
            platform: "twitch",
            user_id: user.id,
        }
        return this.triggerRepository.create(cr)
    }

    async get(id: string): Promise<Trigger | null> {
        const trigger = await this.triggerRepository.get(id)
        if (!trigger) {
            throw new Error("Trigger not found")
        }
        return trigger
    }

    async triggerWorkflows(id: string): Promise<void> {
        const trigger = await this.triggerRepository.get(id)
        if (!trigger) {
            throw new Error("Trigger not found")
        }
        const workflows = await this.workflowRepository.getManyByTriggerId(trigger.id)
        for (const workflow of workflows) {
            this.workflowService.execute(workflow)
        }
    }
}