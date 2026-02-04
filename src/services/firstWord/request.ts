export interface CreateFirstWordRequest {
    twitch_id: string;
    owner_id: string;
    reply_message?: string | null;
    twitch_bot_id?: string | null;
}