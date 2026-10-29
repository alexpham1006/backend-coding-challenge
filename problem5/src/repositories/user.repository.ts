import { db } from "../database/database.js";
import type { User, UserStatus } from "../types/user.js";

export interface CreateUserInput {
    name: string;
    email: string;
    status: UserStatus;
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    status?: UserStatus;
}

export interface ListUsersInput {
    page: number;
    limit: number;
    search?: string;
    status?: UserStatus;
}

export interface ListUsersResult {
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

class UserRepository {
    create(input: CreateUserInput): User {
        const result = db.prepare(`
            INSERT INTO users (name, email, status)
            VALUES (?, ?, ?)
            RETURNING *
        `).run(input.name, input.email, input.status);

        const user = this.findById(result.lastInsertRowid as number);
        if (!user) {
            throw new Error("Failed to load created user");
        }
        return user;
    }

    findById(id: number): User | undefined {
        return db.prepare(`
            SELECT id, name, email, status, created_at, updated_at
            FROM users
            WHERE id = ?
        `).get(id) as User | undefined;
    }

    findAll(input: ListUsersInput): ListUsersResult {
        const { page, limit, search, status } = input;

        const conditions: string[] = [];
        const params: (string | number)[] = [];

        if(search) {
            conditions.push('(name LIKE ? OR email LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        if(status) {
            conditions.push('status = ?');
            params.push(status);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const totalResult = db.prepare(`
            SELECT COUNT(*) as total FROM users
            ${whereClause}
        `).get(...params) as { total: number };

        const offset = (page - 1) * limit;

        const users = db.prepare(`
            SELECT id, name, email, status, created_at, updated_at
            FROM users
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `).all(...params, limit, offset) as unknown as User[];

        return { data: users, total: totalResult.total, page, limit, totalPages: Math.ceil(totalResult.total / limit) };
    }

    update(id: number, input: UpdateUserInput): User | undefined {
        const existingUser = this.findById(id);
        if (!existingUser) {
            return undefined;
        }

        const name = input.name ?? existingUser.name;
        const email = input.email ?? existingUser.email;
        const status = input.status ?? existingUser.status;

        const result = db.prepare(`
            UPDATE users
            SET name = ?, email = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(name, email, status, id);

        return this.findById(id);
    }

    delete(id: number): boolean {
        const result = db.prepare(`
            DELETE FROM users
            WHERE id = ?
        `).run(id);

        return result.changes > 0;
    }
}

export const userRepository = new UserRepository();
