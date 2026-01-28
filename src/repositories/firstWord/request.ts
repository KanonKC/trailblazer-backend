export interface CreateFirstWordRequest {
    owner_id: string;
    reply_message?: string;
}

export interface UpdateFirstWordRequest {
    reply_message?: string;
}
