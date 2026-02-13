import UserService from "@/services/user/user.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../middleware";
import { LoginQuery } from "./request";
import { loginSchema } from "./schemas";
import { z } from "zod";

import logger from "@/libs/winston";
import Configurations from "@/config/index";

export default class UserController {

    private readonly cfg: Configurations;
    private readonly userService: UserService;

    constructor(cfg: Configurations, userService: UserService) {
        this.cfg = cfg;
        this.userService = userService;
    }

    async login(req: FastifyRequest<{ Querystring: LoginQuery }>, res: FastifyReply) {
        logger.info("Login attempt initiated", { layer: "controller", context: "controller.user.login", data: req.query });
        try {
            const query = loginSchema.parse(req.query);
            const request = {
                code: query.code,
                state: query.state,
                scope: query.scope.split(" ")
            };

            const { accessToken, refreshToken, user } = await this.userService.login(request);

            res.setCookie('accessToken', accessToken, {
                path: '/',
                httpOnly: true,
                secure: true, // Should be true in production, maybe false for local dev depending on setup
                sameSite: 'lax',
                maxAge: 60 * 15 // 15 minutes
            });

            res.setCookie('refreshToken', refreshToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
            res.redirect(this.cfg.frontendOrigin); // Redirect to frontend
            logger.info("Login successful", { layer: "controller", context: "controller.user.login", data: user });
        } catch (err) {
            if (err instanceof z.ZodError) {
                logger.warn("Validation error", { layer: "controller", context: "controller.user.login", data: req.query, error: err.message });
                return res.status(400).send({ message: "Validation Error", errors: err.message });
            }
            logger.error("Login failed", { layer: "controller", context: "controller.user.login", data: req.query, error: err });
            res.status(400).send({ message: String(err) })
        }
    }

    async me(req: FastifyRequest, res: FastifyReply) {
        logger.info("Getting current user info", { layer: "controller", context: "controller.user.me" });
        const token = req.cookies.accessToken;
        if (!token) {
            logger.warn("No access token provided", { layer: "controller", context: "controller.user.me" });
            return res.status(401).send({ message: "Unauthorized" });
        }

        try {
            const decoded = verifyToken(token);
            logger.info("Successfully retrieved user info", { layer: "controller", context: "controller.user.me", data: decoded });
            // In a real app, you might want to fetch fresh user data from DB here
            // For now, returning the decoded payload (which contains id and username) is enough check
            res.send(decoded);
        } catch (err) {
            logger.warn("Invalid token", { layer: "controller", context: "controller.user.me", error: err });
            return res.status(401).send({ message: "Invalid token" });
        }
    }

    async logout(_: FastifyRequest, res: FastifyReply) {
        logger.info("User logging out", { layer: "controller", context: "controller.user.logout" });
        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('refreshToken', { path: '/' });
        logger.info("Successfully logged out", { layer: "controller", context: "controller.user.logout" });
        res.status(200).send({ message: "Logged out" });
    }

    async refresh(req: FastifyRequest, res: FastifyReply) {
        logger.info("Token refresh requested", { layer: "controller", context: "controller.user.refresh" });
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            logger.warn("No refresh token provided", { layer: "controller", context: "controller.user.refresh" });
            return res.status(401).send({ message: "No refresh token" });
        }

        try {
            const tokens = await this.userService.refreshToken(refreshToken);

            res.setCookie('accessToken', tokens.accessToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 15 // 15 minutes
            });

            res.setCookie('refreshToken', tokens.refreshToken, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });

            logger.info("Token refreshed successfully", { layer: "controller", context: "controller.user.refresh" });
            res.send({ message: "Token refreshed" });
        } catch (err) {
            logger.error("Token refresh failed", { layer: "controller", context: "controller.user.refresh", error: err });
            res.clearCookie('accessToken', { path: '/' });
            res.clearCookie('refreshToken', { path: '/' });
            res.status(401).send({ message: "Invalid refresh token" });
        }
    }
}
