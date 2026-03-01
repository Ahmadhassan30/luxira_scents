import { api, ApiError } from './api';
import { useAuthStore } from '../store/auth.store';

/**
 * Silently refresh the access token using the HTTP-only refresh cookie.
 * Called on app boot when the in-memory access token is missing (e.g. after page reload).
 * The browser automatically sends the HttpOnly cookie — no JavaScript needed.
 */
export async function silentRefresh(): Promise<boolean> {
    try {
        const response = await api.post<{ accessToken: string }>('/auth/refresh', {});
        if (response.data?.accessToken) {
            useAuthStore.getState().setAccessToken(response.data.accessToken);
            return true;
        }
        return false;
    } catch {
        // No valid refresh token (not logged in, or cookie expired) — stay logged out
        return false;
    }
}

export async function logout(): Promise<void> {
    try {
        await api.post('/auth/logout', {});
    } finally {
        useAuthStore.getState().clearAuth();
    }
}
