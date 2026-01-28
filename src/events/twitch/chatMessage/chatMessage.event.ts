import { HelixEventSubSubscription } from "@twurple/api/lib";
import { FastifyReply, FastifyRequest } from "fastify";
import { ChannelChatMessageEvent } from "./request";
import FirstWordService from "@/services/firstWord/firstWord.service";

export default class ChatMessageEvent {

    private readonly firstWordService: FirstWordService;

    constructor(firstWordService: FirstWordService) {
        this.firstWordService = firstWordService;
    }

    async handle(req: FastifyRequest, res: FastifyReply) {
        console.log("CreateMessageEvent", req.body)

        const body = req.body as any

        if (body.subscription.status === "webhook_callback_verification_pending") {
            console.log("Webhook callback verification pending", body.challenge)
            res.status(200).header("Content-Type", "text/plain").send(body.challenge)
            return
        }

        const event = body.event as ChannelChatMessageEvent

        if (body.subscription.status === "enabled") {
            this.firstWordService.handleTwitchChatMessageEvent(event)
            res.status(204).send()
            return
        }

        res.status(400).send({ message: "Invalid subscription status" })
    }
}