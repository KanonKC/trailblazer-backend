import { FastifyReply, FastifyRequest } from "fastify";
import ClipShoutoutService from "@/services/clipShoutout/clipShoutout.service";
import { TwitchChannelChatNotificationEventRequest } from "./request";

export default class TwitchChannelChatNotificationEvent {
    private readonly clipShoutoutService: ClipShoutoutService;

    constructor(clipShoutoutService: ClipShoutoutService) {
        this.clipShoutoutService = clipShoutoutService;
    }

    async handle(req: FastifyRequest, res: FastifyReply) {
        const body = req.body as any

        if (body.subscription.status === "webhook_callback_verification_pending") {
            res.status(200).header("Content-Type", "text/plain").send(body.challenge)
            return
        }

        const event = body.event as TwitchChannelChatNotificationEventRequest

        if (body.subscription.status === "enabled") {
            this.clipShoutoutService.shoutoutRaider(event)
            res.status(204).send()
            return
        }

        res.status(400).send({ message: "Invalid subscription status" })
    }
}