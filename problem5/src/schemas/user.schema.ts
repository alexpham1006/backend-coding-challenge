import { z } from "zod";

export const createUserSchema = z
    .object({
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().email().max(254),
        status: z.enum(["active", "inactive"]),
    })
    .strict();

export const updateUserSchema = z
    .object({
        name: z.string().trim().min(1).max(100).optional(),
        email: z.string().trim().email().max(254).optional(),
        status: z.enum(["active", "inactive"]).optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
    });

export const listUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(100).optional(),
    status: z.enum(['active', 'inactive']).optional(),
}).strict();

export const userIdSchema = z.coerce.number().int().positive();
