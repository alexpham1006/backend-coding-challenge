export type UserStatus = 'active' | 'inactive'

export interface User {
    id: number;
    name: string;
    email: string;
    status: UserStatus;
    created_at: string;
    updated_at: string;
}