import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if(err?.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    if(err?.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Request body too large' });
    }

    const message = err instanceof Error ? err.message : '';

    if(message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'A user with this email already exists' });
    }

    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
}
