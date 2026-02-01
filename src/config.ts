import type Configurations from "@/config/index";
import { configDotenv } from "dotenv";

configDotenv()

const config: Configurations = {
    origin: process.env.ORIGIN || "",
    jwtSecret: process.env.JWT_SECRET || "",
    cookieSecret: process.env.COOKIE_SECRET || "",
    frontendOrigin: process.env.FRONTEND_ORIGIN || "",
    twitch: {
        clientId: process.env.TWITCH_CLIENT_ID || "",
        clientSecret: process.env.TWITCH_CLIENT_SECRET || "",
        redirectUrl: process.env.TWITCH_REDIRECT_URL || "",
        defaultBotId: process.env.TWITCH_DEFAULT_BOT_ID || ""
    }
}

export default config;
