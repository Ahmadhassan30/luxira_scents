'use client';

import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth.store';
import { api } from '../lib/api';
import type { UserPublic } from '@perfume/shared';

export function useAuth() {
    const { user, accessToken, isInitialized, setAuth, clearAuth, setAccessToken } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const { data } = await api.post<{ accessToken: string; user: UserPublic }>('/auth/login', {
                email,
                password,
            });
            return data!;
        },
        onSuccess: ({ accessToken, user }) => setAuth(accessToken, user),
    });

    const registerMutation = useMutation({
        mutationFn: async (payload: {
            email: string;
            password: string;
            firstName?: string;
            lastName?: string;
        }) => {
            const { data } = await api.post<{ accessToken: string; user: UserPublic }>(
                '/auth/register',
                payload,
            );
            return data!;
        },
        onSuccess: ({ accessToken, user }) => setAuth(accessToken, user),
    });

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout', {});
        } finally {
            clearAuth();
        }
    }, [clearAuth]);

    return {
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        isInitialized,
        login: loginMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        logout,
        isLoginLoading: loginMutation.isPending,
        isRegisterLoading: registerMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
    };
}
