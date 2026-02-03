export interface CreateUserRequest {
    twitch_id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    refresh_token?: string;
    refresh_token_expires_at?: Date;
}

export interface UpdateUserRequest {
    username?: string;
    display_name?: string;
    avatar_url?: string | null;
    refresh_token?: string;
    refresh_token_expires_at?: Date;
}