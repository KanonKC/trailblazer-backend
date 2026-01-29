import { prisma } from "@/libs/prisma";
import redis from "@/libs/redis";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import logger from "@/libs/winston";

export function verifyToken(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET || "secret");
}

export function getUserFromRequest(req: FastifyRequest): { id: string } | null {
    let token = req.cookies.accessToken;
    console.log('middleware token', token)
    if (!token) {
        token = req.headers.authorization?.split(" ")[1];
    }
    if (!token) return null;
    try {
        const decoded = verifyToken(token);
        if (typeof decoded === 'string') {
            console.log('decoded is string', decoded)
            return null;
        };
        return decoded as { id: string, twitchId: string };
    } catch (e) {
        console.log('e', e)
        return null;
    }
}

async function refresh(refreshToken: string) {
    if (!refreshToken) {
        throw new Error("No refresh token");
    }

    try {
        const userId = await redis.get(`refresh_token:${refreshToken}`);

        if (!userId) {
            throw new Error("Invalid refresh token");
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error("User not found");
        }

        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username, displayName: user.display_name, avatarUrl: user.avatar_url, twitchId: user.twitch_id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "15m" }
        );
        const newRefreshToken = crypto.randomBytes(40).toString("hex");

        await redis.del(`refresh_token:${refreshToken}`);
        await redis.set(`refresh_token:${newRefreshToken}`, user.id, { EX: 60 * 60 * 24 * 7 });

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
        logger.error("Token refresh failed", { error: err });
        throw new Error("Invalid refresh token");
    }
}

export async function authenticationRequired(req: FastifyRequest, res: FastifyReply) {
    let token = req.cookies.accessToken;
    console.log('middleware token', token)
    if (!token) {
        token = req.headers.authorization?.split(" ")[1];
    }

    if (!token) {

        let newTokens: { accessToken: string, refreshToken: string };
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            console.log('no token')
            res.status(401).send({ error: "Unauthorized" });
            return;
        };
        try {
            newTokens = await refresh(refreshToken);
            res.setCookie('accessToken', newTokens.accessToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 15 // 15 minutes
            });

            res.setCookie('refreshToken', newTokens.refreshToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
        } catch (e) {
            console.log('e', e)
            res.status(401).send({ error: "Unauthorized" });
            return;
        }

        token = newTokens.accessToken;
    }

    try {
        const decoded = verifyToken(token);
        if (typeof decoded === 'string') {
            console.log('decoded is string', decoded)
            res.status(401).send({ error: "Unauthorized" });
            return;
        };
        return decoded as { id: string, twitchId: string };
    } catch (e) {
        console.log('e', e)
        res.status(401).send({ error: "Unauthorized" });
        return;
    }
}
