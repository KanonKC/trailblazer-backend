import { prisma } from "@/libs/prisma";
import { User, Workflow } from "generated/prisma/client";

export default class WorkflowRepository {
    constructor() { }

    async get(id: string): Promise<Workflow | null> {
        return prisma.workflow.findUnique({ where: { id } })
    }

    async getOwner(id: string): Promise<User | null> {
        const workflow = await prisma.workflow.findUnique({ where: { id }, include: { owner: true } })
        return workflow?.owner ?? null
    }

    async getManyByTriggerId(triggerId: string): Promise<Workflow[]> {
        return prisma.workflow.findMany({ where: { triggers: { some: { id: triggerId } } } })
    }

}