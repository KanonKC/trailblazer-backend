import TwitchService from "@/services/twitch/twitch";
import { FastifyReply, FastifyRequest } from "fastify";
import { getUserFromRequest } from "../middleware";

export default class TwitchController {
    private twitchService: TwitchService;
    constructor(twitchService: TwitchService) {
        this.twitchService = twitchService;
    }

    async getChannelRewards(req: FastifyRequest, res: FastifyReply) {
        const user = getUserFromRequest(req);
        if (!user) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const response = await this.twitchService.getChannelRewards(user.twitchId);
        return res.status(200).send(response);
    }
}