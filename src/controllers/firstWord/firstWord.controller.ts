import { FastifyReply, FastifyRequest } from "fastify";
import FirstWordService from "@/services/firstWord/firstWord.service";
import { CreateFirstWordRequest } from "@/repositories/firstWord/request";

export default class FirstWordController {
    private firstWordService: FirstWordService;

    constructor(firstWordService: FirstWordService) {
        this.firstWordService = firstWordService;
    }

    async create(req: FastifyRequest, res: FastifyReply) {
        try {
            const request = req.body as CreateFirstWordRequest;
            await this.firstWordService.create(request);
            res.status(201).send();
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    }
}
