import { FastifyReply, FastifyRequest } from "fastify";
import { subscriber } from "@/libs/redis";
import FirstWordService from "@/services/firstWord/firstWord.service";

export default class FirstWordEventController {
    private firstWordService: FirstWordService;

    constructor(firstWordService: FirstWordService) {
        this.firstWordService = firstWordService;
    }
    // Map of userId -> Set of connections
    private connections: Map<string, Set<FastifyReply>> = new Map();

    // TODO: Make rate limited
    async sse(req: FastifyRequest<{ Params: { userId: string }, Querystring: { key: string } }>, res: FastifyReply) {
        const { userId } = req.params;
        const { key } = req.query;

        console.log("SSE Connection attempt:", userId, key);

        const isValid = await this.firstWordService.validateOverlayAccess(userId, key);
        if (!isValid) {
            console.log("Invalid key for SSE:", userId);
            // End response immediately
            res.raw.end();
            return;
        }

        res.sse({
            event: "connected",
            data: "connected"
        });

        // Track connection
        if (!this.connections.has(userId)) {
            this.connections.set(userId, new Set());
        }
        this.connections.get(userId)!.add(res);

        const sub = subscriber.duplicate();
        await sub.connect();

        await sub.subscribe("first-word-audio", (message) => {
            const payload = JSON.parse(message);
            if (payload.userId === userId) {
                res.sse({
                    event: "audio",
                    data: JSON.stringify({ url: payload.audioUrl })
                });
            }
        });

        req.raw.on("close", () => {
            sub.quit();
            const userConns = this.connections.get(userId);
            if (userConns) {
                userConns.delete(res);
                if (userConns.size === 0) {
                    this.connections.delete(userId);
                }
            }
        });
    }

    public disconnectUser(userId: string) {
        const userConns = this.connections.get(userId);
        if (userConns) {
            console.log(`Disconnecting ${userConns.size} clients for user ${userId}`);
            for (const res of userConns) {
                res.raw.end();
            }
            this.connections.delete(userId);
        }
    }
}
