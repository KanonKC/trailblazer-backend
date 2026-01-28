import { prisma } from "@/libs/prisma";
import { FirstWord } from "generated/prisma/client";
import { CreateFirstWordRequest, UpdateFirstWordRequest } from "./request";

export default class FirstWordRepository {
    constructor() { }

    async create(request: CreateFirstWordRequest): Promise<FirstWord> {
        return prisma.firstWord.create({
            data: request
        });
    }

    async get(id: string): Promise<FirstWord | null> {
        return prisma.firstWord.findUnique({ where: { id } });
    }

    async getByOwnerId(owner_id: string): Promise<FirstWord | null> {
        return prisma.firstWord.findUnique({ where: { owner_id } });
    }

    async update(id: string, request: UpdateFirstWordRequest): Promise<FirstWord> {
        return prisma.firstWord.update({
            where: { id },
            data: request
        });
    }

    async delete(id: string): Promise<FirstWord> {
        return prisma.firstWord.delete({ where: { id } });
    }
}
