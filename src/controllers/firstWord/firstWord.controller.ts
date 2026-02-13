import { FastifyReply, FastifyRequest } from "fastify";
import FirstWordService from "@/services/firstWord/firstWord.service";
import FirstWordEventController from "./firstWord.event.controller";
import { getUserFromRequest } from "../middleware";
import { createFirstWordSchema, updateFirstWordSchema } from "./schemas";
import { z } from "zod";
import logger from "@/libs/winston";

export default class FirstWordController {
    private firstWordService: FirstWordService;
    private firstWordEventController: FirstWordEventController;

    constructor(firstWordService: FirstWordService, firstWordEventController: FirstWordEventController) {
        this.firstWordService = firstWordService;
        this.firstWordEventController = firstWordEventController;
    }

    async get(req: FastifyRequest, res: FastifyReply) {
        logger.info("Getting first word config", { layer: "controller", context: "controller.firstWord.get" });
        const user = getUserFromRequest(req);
        if (!user) {
            logger.warn("Unauthorized access attempt", { layer: "controller", context: "controller.firstWord.get" });
            return res.status(401).send({ message: "Unauthorized" });
        }

        try {
            const firstWord = await this.firstWordService.getByUserId(user.id);
            if (!firstWord) {
                logger.info("First word not enabled", { layer: "controller", context: "controller.firstWord.get", data: { userId: user.id } });
                return res.status(404).send({ message: "First word not enabled" });
            }
            logger.info("Successfully retrieved first word", { layer: "controller", context: "controller.firstWord.get", data: { userId: user.id } });
            res.send(firstWord);
        } catch (error) {
            logger.error("Failed to get first word", { layer: "controller", context: "controller.firstWord.get", data: { userId: user.id }, error });
            res.status(500).send({ message: "Internal Server Error" });
        }
    }

    async update(req: FastifyRequest, res: FastifyReply) {
        logger.info("Updating first word config", { layer: "controller", context: "controller.firstWord.update" });
        const user = getUserFromRequest(req);
        if (!user) {
            logger.warn("Unauthorized access attempt", { layer: "controller", context: "controller.firstWord.update" });
            return res.status(401).send({ message: "Unauthorized" });
        }

        try {
            const request = updateFirstWordSchema.parse(req.body);
            const updated = await this.firstWordService.update(user.id, request);
            logger.info("Successfully updated first word", { layer: "controller", context: "controller.firstWord.update", data: { userId: user.id } });
            res.send(updated);
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.warn("Validation error", { layer: "controller", context: "controller.firstWord.update", error: error.message });
                return res.status(400).send({ message: "Validation Error", errors: error.message });
            }
            logger.error("Failed to update first word", { layer: "controller", context: "controller.firstWord.update", data: { userId: user.id }, error });
            res.status(500).send({ message: "Internal Server Error" });
        }
    }

    async create(req: FastifyRequest, res: FastifyReply) {
        logger.info("Creating first word config", { layer: "controller", context: "controller.firstWord.create" });
        const user = getUserFromRequest(req);
        if (!user) {
            logger.warn("Unauthorized access attempt", { layer: "controller", context: "controller.firstWord.create" });
            return res.status(401).send({ message: "Unauthorized" });
        }

        try {
            const request = createFirstWordSchema.parse(req.body);
            const created = await this.firstWordService.create(request);
            logger.info("Successfully created first word", { layer: "controller", context: "controller.firstWord.create", data: { userId: user.id } });
            res.status(201).send(created);
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.warn("Validation error", { layer: "controller", context: "controller.firstWord.create", error: error.issues });
                return res.status(400).send({ message: "Validation Error", errors: error.issues });
            }
            logger.error("Failed to create first word", { layer: "controller", context: "controller.firstWord.create", data: { userId: user.id }, error });
            res.status(500).send({ message: "Internal Server Error" });
        }
    }

    async delete(req: FastifyRequest, res: FastifyReply) {
        logger.info("Deleting first word config", { layer: "controller", context: "controller.firstWord.delete" });
        const user = getUserFromRequest(req);
        if (!user) {
            logger.warn("Unauthorized access attempt", { layer: "controller", context: "controller.firstWord.delete" });
            return res.status(401).send({ message: "Unauthorized" });
        }

        try {
            await this.firstWordService.delete(user.id);
            logger.info("Successfully deleted first word", { layer: "controller", context: "controller.firstWord.delete", data: { userId: user.id } });
            res.status(204).send();
        } catch (error) {
            logger.error("Failed to delete first word", { layer: "controller", context: "controller.firstWord.delete", data: { userId: user.id }, error });
            res.status(500).send({ message: "Internal Server Error" });
        }
    }

    async refreshKey(req: FastifyRequest, res: FastifyReply) {
        logger.info("Refreshing overlay key", { layer: "controller", context: "controller.firstWord.refreshKey" });
        const user = getUserFromRequest(req);
        if (!user) {
            logger.warn("Unauthorized access attempt", { layer: "controller", context: "controller.firstWord.refreshKey" });
            return res.status(401).send({ message: "Unauthorized" });
        }

        try {
            const updated = await this.firstWordService.refreshOverlayKey(user.id);
            this.firstWordEventController.disconnectUser(user.id);
            logger.info("Successfully refreshed overlay key", { layer: "controller", context: "controller.firstWord.refreshKey", data: { userId: user.id } });
            res.send(updated);
        } catch (error) {
            logger.error("Failed to refresh overlay key", { layer: "controller", context: "controller.firstWord.refreshKey", data: { userId: user.id }, error });
            res.status(500).send({ message: "Internal Server Error" });
        }
    }

    async uploadAudio(req: FastifyRequest, res: FastifyReply) {
        logger.info("Uploading audio file", { layer: "controller", context: "controller.firstWord.uploadAudio" });
        const user = getUserFromRequest(req);
        if (!user) {
            logger.warn("Unauthorized access attempt", { layer: "controller", context: "controller.firstWord.uploadAudio" });
            return res.status(401).send({ message: "Unauthorized" });
        }

        try {
            const file = await req.file();
            if (!file) {
                logger.warn("No file provided", { layer: "controller", context: "controller.firstWord.uploadAudio", data: { userId: user.id } });
                return res.status(400).send({ message: "File is required" });
            }
            const buffer = await file.toBuffer();
            await this.firstWordService.uploadAudio(user.id, {
                buffer,
                filename: file.filename,
                mimetype: file.mimetype
            });
            logger.info("Successfully uploaded audio", { layer: "controller", context: "controller.firstWord.uploadAudio", data: { userId: user.id, filename: file.filename } });
            res.status(201).send();
        } catch (error) {
            logger.error("Failed to upload audio", { layer: "controller", context: "controller.firstWord.uploadAudio", data: { userId: user.id }, error });
            res.status(500).send({ message: "Internal Server Error" });
        }
    }

}
