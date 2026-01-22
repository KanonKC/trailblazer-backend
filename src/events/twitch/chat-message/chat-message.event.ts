import { HelixEventSubSubscription } from "@twurple/api/lib";
import { FastifyReply, FastifyRequest } from "fastify";

export default class ChatMessageEvent {
    constructor() { }

    async handle(req: FastifyRequest, res: FastifyReply) {
        console.log("CreateMessageEvent", req.body)
 
        const body = req.body as any

        if (body.subscription.status === "webhook_callback_verification_pending") {
            console.log("Webhook callback verification pending", body.challenge)
            res.status(200).header("Content-Type", "text/plain").send(body.challenge)
            return
        }

        else if (body.subscription.status === "enabled") {
            res.status(204).send()
            return
        }

        res.status(400).send({ message: "Invalid subscription status" })
    }
}