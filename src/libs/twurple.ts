import config from "@/config";
import { ApiClient, HelixEventSubTransportOptions } from "@twurple/api";
import { AppTokenAuthProvider } from "@twurple/auth";
import crypto from "crypto"

const clientId = "lnn0xjhakjukg3r77tgnjpquxt1y2t"
const clientSecret = "v6jct9yi6j35maiql4eqwa1263ybka"

const authProvider = new AppTokenAuthProvider(clientId, clientSecret, ["channel:read:subscriptions"])
export const twitchAppAPI = new ApiClient({ authProvider });

export function createESTransport(route: string): HelixEventSubTransportOptions {
    return {
        method: "webhook",
        callback: `${config.origin}${route}`,
        secret: crypto.randomBytes(16).toString("hex")
    }
}