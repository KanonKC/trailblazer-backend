export default interface Configurations {
    origin: string;
    twitch: {
        clientId: string;
        clientSecret: string;
        redirectUrl: string;
        defaultBotId: string;
    }
}