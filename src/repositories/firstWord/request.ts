export interface CreateFirstWordRequest {
    twitch_id: string;
    owner_id: string;
    reply_message?: string | null;
    overlay_key: string;
    twitch_bot_id?: string | null;
}

export interface UpdateFirstWordRequest {
    reply_message?: string | null;
    enabled?: boolean;
    audio_key?: string | null;
    overlay_key?: string;
    twitch_bot_id?: string | null;
}

export interface AddChatterRequest {
    first_word_id: string;
    twitch_chatter_id: string;
    twitch_channel_id: string;
}
