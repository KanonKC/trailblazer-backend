import { prisma } from "@/libs/prisma";
import { Trigger } from "generated/prisma/client";
import { CreateTriggerRequest } from "./request";

export default class TriggerRepository {
    constructor() { }

    async create(request: CreateTriggerRequest): Promise<Trigger> {
        return prisma.trigger.create({
            data: request
        })
    }

    async get(id: string): Promise<Trigger | null> {
        return prisma.trigger.findUnique({ where: { id } })
    }
}