import { z } from "zod";

export const createFirstWordSchema = z.object({
    twitch_id: z.string().min(1),
    owner_id: z.cuid(),
    reply_message: z.string().optional(),
    twitch_bot_id: z.string().optional().nullable(),
});

export const updateFirstWordSchema = z.object({
    reply_message: z.string().optional().nullable(),
    enabled: z.boolean().optional(),
    audio_key: z.string().optional().nullable(),
    overlay_key: z.string().optional(),
    twitch_bot_id: z.string().optional().nullable(),
});

export type CreateFirstWordSchema = z.infer<typeof createFirstWordSchema>;
export type UpdateFirstWordSchema = z.infer<typeof updateFirstWordSchema>;
