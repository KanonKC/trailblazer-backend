export interface CreateClipShoutoutRequest {
    twitch_id: string;
    enabled?: boolean;
    twitch_bot_id: string;
    reply_message?: string | null;
    enabled_clip?: boolean;
    enabled_highlight_only?: boolean;
    overlay_key: string;
    owner_id: string;
}

export interface UpdateClipShoutoutRequest {
    enabled?: boolean;
    twitch_bot_id?: string;
    reply_message?: string | null;
    enabled_clip?: boolean;
    enabled_highlight_only?: boolean;
    overlay_key?: string;
}