import { prisma } from "@/libs/prisma";
import { FirstWord, FirstWordChatter } from "generated/prisma/client";
import { AddChatterRequest, CreateFirstWordRequest, UpdateFirstWordRequest } from "./request";
import WidgetRepository, { WidgetTypeSlug } from "../widget/widget.repository";

export default class FirstWordRepository extends WidgetRepository {
    constructor() {
        super(WidgetTypeSlug.FIRST_WORD);
    }

    async create(request: CreateFirstWordRequest) {
        return prisma.firstWord.create({
            data: request
        });
    }

    async get(id: string) {
        return prisma.firstWord.findUnique({ where: { id } });
    }

    async update(id: string, request: UpdateFirstWordRequest) {
        console.log("Update request:", request);
        return prisma.firstWord.update({
            where: { id },
            data: request
        });
    }

    async delete(id: string) {
        return prisma.firstWord.delete({ where: { id } });
    }

    async addChatter(request: AddChatterRequest) {
        await prisma.firstWordChatter.create({
            data: request
        });
    }

    async getChatter(id: string, chatterId: string) {
        return prisma.firstWordChatter.findUnique({
            where: {
                twitch_chatter_id_first_word_id: {
                    first_word_id: id,
                    twitch_chatter_id: chatterId
                }
            }
        });
    }

    async getChatters(id: string) {
        return prisma.firstWordChatter.findMany({
            where: {
                first_word_id: id
            }
        });
    }

    async getChattersByChannelId(channelId: string) {
        return prisma.firstWordChatter.findMany({
            where: {
                twitch_channel_id: channelId
            }
        });
    }

    async clearChatters(id: string) {
        await prisma.firstWordChatter.deleteMany({
            where: {
                first_word_id: id
            }
        });
    }
}
