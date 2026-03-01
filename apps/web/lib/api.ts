import type { ApiResponse } from '@perfume/shared';
import { useAuthStore } from '../store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL && typeof window !== 'undefined') {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
}

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public errors?: Array<{ field?: string; message: string }>,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) ?? {}),
    };

    // Security fix: access token is kept in Zustand memory state only — never localStorage.
    // On page reload the token is gone (intentional); the app's auth init calls /auth/refresh
    // which uses the HTTP-only cookie to restore the session silently.
    if (typeof window !== 'undefined') {
        const token = useAuthStore.getState().accessToken;
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL ?? ''}${endpoint}`, { ...options, headers });
    const json: ApiResponse<T> = await response.json();

    if (!response.ok) {
        throw new ApiError(
            response.status,
            (json as Record<string, unknown>).message as string ?? 'Request failed',
            (json as Record<string, unknown>).errors as ApiError['errors'],
        );
    }

    return json;
}

export const api = {
    get: <T>(url: string, init?: RequestInit) =>
        request<T>(url, { ...init, method: 'GET' }),
    post: <T>(url: string, body: unknown, init?: RequestInit) =>
        request<T>(url, { ...init, method: 'POST', body: JSON.stringify(body) }),
    patch: <T>(url: string, body: unknown, init?: RequestInit) =>
        request<T>(url, { ...init, method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(url: string, init?: RequestInit) =>
        request<T>(url, { ...init, method: 'DELETE' }),
};
