import { prisma } from "@/libs/prisma";
import redis from "@/libs/redis";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import logger from "@/libs/winston";
import config from "@/config";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days (seconds)
const COOKIE_MAX_AGE_ACCESS = 60 * 15; // 15 minutes (seconds)
const COOKIE_MAX_AGE_REFRESH = 60 * 60 * 24 * 7; // 7 days (seconds)

function extractToken(req: FastifyRequest): string | undefined {
    if (req.cookies.accessToken) {
        return req.cookies.accessToken;
    }
    if (req.headers.authorization) {
        return req.headers.authorization.split(" ")[1];
    }
    return undefined;
}

export function verifyToken(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, config.jwtSecret);
}

export function getUserFromRequest(req: FastifyRequest): { id: string } | null {
    const token = extractToken(req);
    // logger.debug('getUserFromRequest token found', { tokenString: !!token });

    if (!token) return null;

    try {
        const decoded = verifyToken(token);
        if (typeof decoded === 'string') {
            logger.warn('getUserFromRequest: decoded token is string', { decoded });
            return null;
        }
        return decoded as { id: string, twitchId: string };
    } catch (e) {
        // logger.error('getUserFromRequest error', { error: e });
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
            config.jwtSecret,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );
        const newRefreshToken = crypto.randomBytes(40).toString("hex");

        await redis.del(`refresh_token:${refreshToken}`);
        await redis.set(`refresh_token:${newRefreshToken}`, user.id, { EX: REFRESH_TOKEN_EXPIRY });

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
        logger.error("Token refresh failed", { error: err });
        throw new Error("Invalid refresh token");
    }
}

export async function authenticationRequired(req: FastifyRequest, res: FastifyReply) {
    let token = extractToken(req);

    if (!token) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            logger.debug('authenticationRequired: No access or refresh token');
            res.status(401).send({ error: "Unauthorized" });
            return;
        }

        try {
            const newTokens = await refresh(refreshToken);

            res.setCookie('accessToken', newTokens.accessToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: COOKIE_MAX_AGE_ACCESS
            });

            res.setCookie('refreshToken', newTokens.refreshToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: COOKIE_MAX_AGE_REFRESH
            });

            token = newTokens.accessToken;
        } catch (e) {
            logger.error('authenticationRequired: Refresh failed', { error: e });
            console.log('1', e);
            res.status(401).send({ error: "Unauthorized" });
            return;
        }
    }

    try {
        const decoded = verifyToken(token!); // Token is guaranteed to be string here because of logic above
        if (typeof decoded === 'string') {
            logger.warn('authenticationRequired: decoded token is string', { decoded });
            console.log('2');
            res.status(401).send({ error: "Unauthorized" });
            return;
        }
        console.log('4');
        return decoded as { id: string, twitchId: string };
    } catch (e) {
        logger.error('authenticationRequired: Token verification failed', { error: e });
        console.log('3', e);
        res.status(401).send({ error: "Unauthorized" });
        return;
    }
}
