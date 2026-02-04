import config from "@/config";
import { ApiClient, HelixEventSubTransportOptions } from "@twurple/api";
import { AppTokenAuthProvider, StaticAuthProvider } from "@twurple/auth";
import crypto from "crypto";

const clientId = process.env.TWITCH_CLIENT_ID!;
const clientSecret = process.env.TWITCH_CLIENT_SECRET!;

const authProvider = new AppTokenAuthProvider(clientId, clientSecret, ["channel:read:subscriptions"])
export const twitchAppAPI = new ApiClient({ authProvider });

export function createTwitchUserAPI(token: string): ApiClient {
    const provider = new StaticAuthProvider(clientId, token)
    return new ApiClient({ authProvider: provider })
}

export function createESTransport(route: string): HelixEventSubTransportOptions {
    return {
        method: "webhook",
        callback: `${config.origin}${route}`,
        secret: crypto.randomBytes(16).toString("hex")
    }
}