import { FastifyReply, FastifyRequest } from "fastify";
import SystemService from "@/services/system/system.service";
import logger from "@/libs/winston";

export default class SystemController {
    private systemService: SystemService;

    constructor(systemService: SystemService) {
        this.systemService = systemService;
    }

    async health(_: FastifyRequest, res: FastifyReply) {
        logger.info("controller.system.health: Health check initiated");
        const health = await this.systemService.getHealth();

        const isHealthy = health.database && Object.values(health.libs).every(x => x);

        if (!isHealthy) {
            logger.error("controller.system.health: Health check failed", { health });
            return res.status(503).send(health);
        }

        logger.info("system.controller.health: Health check passed", { health });
        res.send(health);
    }
}
