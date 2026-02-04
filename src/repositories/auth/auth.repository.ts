import { prisma } from "@/libs/prisma";
import { Auth } from "../../../generated/prisma/client";
import { UpdateTwitchTokenRequest } from "./request";

export default class AuthRepository {
    constructor() { }

    async create(userId: string): Promise<Auth> {
        return prisma.auth.create({
            data: {
                user_id: userId,
            }
        })
    }

    async updateTwitchToken(userId: string, request: UpdateTwitchTokenRequest): Promise<Auth> {
        return prisma.auth.upsert({
            where: {
                user_id: userId
            },
            update: request,
            create: {
                user_id: userId,
                ...request
            }
        })
    }

    async getByUserId(userId: string): Promise<Auth | null> {
        return prisma.auth.findUnique({
            where: {
                user_id: userId
            }
        })
    }

    async getByTwitchRefreshToken(twitchRefreshToken: string) {
        return prisma.auth.findUnique({
            where: {
                twitch_refresh_token: twitchRefreshToken
            }
        })
    }
}