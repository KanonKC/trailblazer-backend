import { exchangeCode, getTokenInfo } from "@twurple/auth";
import Configurations from "@/config/index";
import { JWTPayload, LoginRequest } from "./request";
import { twitchAppAPI } from "@/libs/twurple";
import UserRepository from "@/repositories/user/user.repository";
import { CreateUserRequest } from "@/repositories/user/request";
import jwt from "jsonwebtoken";
import redis, { TTL } from "@/libs/redis";
import crypto from "crypto";
import { User } from "generated/prisma/client";

export default class UserService {
    private readonly cfg: Configurations
    private readonly userRepository: UserRepository

    constructor(cfg: Configurations, userRepository: UserRepository) {
        this.cfg = cfg
        this.userRepository = userRepository
    }

    async login(request: LoginRequest): Promise<{ accessToken: string, refreshToken: string, user: User }> {
        const token = await exchangeCode(
            this.cfg.twitch.clientId,
            this.cfg.twitch.clientSecret,
            request.code,
            this.cfg.twitch.redirectUrl
        )

        const tokenInfo = await getTokenInfo(token.accessToken, this.cfg.twitch.clientId)

        if (!tokenInfo.userId) {
            throw new Error("Invalid token info")
        }

        const twitchUser = await twitchAppAPI.users.getUserById(tokenInfo.userId)
        if (!twitchUser) {
            throw new Error("Invalid Twitch user")
        }

        const refreshToken = crypto.randomBytes(40).toString("hex");

        const cr: CreateUserRequest = {
            twitch_id: twitchUser.id,
            username: twitchUser.name,
            display_name: twitchUser.displayName,
            avatar_url: twitchUser.profilePictureUrl,
            refresh_token: refreshToken,
            refresh_token_expires_at: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)
        }

        const user = await this.userRepository.upsert(cr)
        const accessToken = await this.createAccessToken(user);

        return { accessToken, refreshToken, user };
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await this.userRepository.getByRefreshToken(refreshToken)

        if (!user) {
            throw new Error("Invalid refresh token");
        }

        const newAccessToken = await this.createAccessToken(user);
        const newRefreshToken = crypto.randomBytes(40).toString("hex");

        await this.userRepository.update(user.id, {
            refresh_token: newRefreshToken,
            refresh_token_expires_at: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)
        })


        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    createJWTPayload(user: User): JWTPayload {
        return {
            id: user.id,
            username: user.username,
            displayName: user.display_name,
            avatarUrl: user.avatar_url,
            twitchId: user.twitch_id
        }
    }

    async createAccessToken(user: User): Promise<string> {
        const accessToken = jwt.sign(
            this.createJWTPayload(user),
            this.cfg.jwtSecret,
            { expiresIn: "15m" }
        );
        await redis.set(`user:access_token:${accessToken}`, user.id, TTL.ONE_WEEK);
        return accessToken;
    }
}
