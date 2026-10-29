import { RequestHandler } from "express";
import { createUserSchema, listUsersQuerySchema, updateUserSchema, userIdSchema } from "../schemas/user.schema.js";
import { userRepository } from "../repositories/user.repository.js";

export const createUser: RequestHandler = (req, res) => {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message, details: parsed.error.issues });
    }

    const user = userRepository.create(parsed.data);
    res.status(201).json({data: user});
}

export const getUsers: RequestHandler = (req, res) => {
    const parsed = listUsersQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid query parameters", details: parsed.error.issues });
    }

    const users = userRepository.findAll(parsed.data);
    res.status(200).json({data: users});
}

export const getUserById: RequestHandler = (req, res) => {
    const parsedId = userIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        return res.status(400).json({ error: 'Invalid user ID'});
    }

    const user = userRepository.findById(parsedId.data);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({data: user});
}

export const updateUser: RequestHandler = (req, res) => {
    const parsedId = userIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        return res.status(400).json({ error: 'Invalid user ID'});
    }

    const parseBody = updateUserSchema.safeParse(req.body);
    if (!parseBody.success) {
        return res.status(400).json({ error: 'Invalid request body', });
    }

    const user = userRepository.update(parsedId.data, parseBody.data);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({data: user});
}

export const deleteUser: RequestHandler = (req, res) => {
    const parsedId = userIdSchema.safeParse(req.params.id);
    if (!parsedId.success) {
        return res.status(400).json({ error: 'Invalid user ID'});
    }

    const user = userRepository.delete(parsedId.data);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({data: user});
}
