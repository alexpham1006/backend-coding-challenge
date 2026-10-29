import express from 'express';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/error-handler.middleware.js';

export default function createApp() {
    const app = express();

    app.use(express.json());

    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    app.use('/users', userRoutes);

    app.use((_req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });

    app.use(errorHandler);

    return app;
}
