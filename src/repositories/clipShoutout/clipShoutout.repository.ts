import { prisma } from "@/libs/prisma";
import { CreateClipShoutoutRequest, UpdateClipShoutoutRequest } from "./request";

export default class ClipShoutoutRepository {

    constructor() {
    }

    async create(data: CreateClipShoutoutRequest) {
        return prisma.clipShoutout.create({
            data,
        });
    }

    async update(id: string, data: UpdateClipShoutoutRequest) {
        return prisma.clipShoutout.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return prisma.clipShoutout.delete({
            where: { id },
        });
    }

    async getByOwnerId(ownerId: string) {
        return prisma.clipShoutout.findUnique({
            where: { owner_id: ownerId },
            include: {
                owner: true,
            }
        });
    }

    async getByTwitchId(twitchId: string) {
        return prisma.clipShoutout.findUnique({
            where: { twitch_id: twitchId },
            include: {
                owner: true,
            }
        });
    }
}