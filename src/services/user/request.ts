export interface LoginRequest {
    code: string;
    state: string;
    scope: string[];
}

export interface JWTPayload {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    twitchId: string;
}