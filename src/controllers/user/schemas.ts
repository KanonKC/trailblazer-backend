import { z } from "zod";

export const loginSchema = z.object({
    code: z.string().min(1, "Code is required"),
    state: z.string().min(1, "State is required"),
    scope: z.string().min(1, "Scope is required"),
});
