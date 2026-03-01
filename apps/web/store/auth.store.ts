import { create } from 'zustand';
import type { UserPublic } from '@perfume/shared';

interface AuthState {
    // Access token lives in MEMORY ONLY — never localStorage, never sessionStorage.
    // It is intentionally cleared on page reload.
    // Session is restored via silentRefresh() which uses the HTTP-only cookie.
    accessToken: string | null;
    user: UserPublic | null;
    isInitialized: boolean; // false until silentRefresh() has been attempted on mount

    setAuth: (accessToken: string, user: UserPublic) => void;
    setAccessToken: (token: string) => void;
    clearAuth: () => void;
    setInitialized: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    accessToken: null,
    user: null,
    isInitialized: false,

    setAuth: (accessToken, user) => set({ accessToken, user }),
    setAccessToken: (accessToken) => set({ accessToken }),
    clearAuth: () => set({ accessToken: null, user: null }),
    setInitialized: () => set({ isInitialized: true }),
}));
