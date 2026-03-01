import { Role } from '../constants/roles';

export interface User {
    id: string;
    email: string;
    role: Role;
    firstName?: string;
    lastName?: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserPublic {
    id: string;
    email: string;
    role: Role;
    firstName?: string;
    lastName?: string;
}
