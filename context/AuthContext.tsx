import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Models } from "react-native-appwrite";
import "react-native-url-polyfill/auto";

import {
    createSessionFromOAuthSecret,
    getCurrentUser,
    getOAuthLoginUrl,
    loginWithEmail,
    logoutCurrentSession,
    registerWithEmail,
} from "@/services/appwrite";

type AuthUser = Models.User<Models.Preferences> | null;

type LoginPayload = {
    email: string;
    password: string;
};

type RegisterPayload = LoginPayload & {
    confirmPassword: string;
    name?: string;
};

type AuthContextValue = {
    user: AuthUser;
    initializing: boolean;
    refresh: () => Promise<void>;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser>(null);
    const [initializing, setInitializing] = useState(true);

    const refresh = useCallback(async () => {
        const account = await getCurrentUser();
        setUser(account);
    }, []);

    const bootstrap = useCallback(async () => {
        setInitializing(true);
        try {
            await refresh();
        } finally {
            setInitializing(false);
        }
    }, [refresh]);

    useEffect(() => {
        void bootstrap();
    }, [bootstrap]);

    const handleLogin = useCallback(
        async ({ email, password }: LoginPayload) => {
            await loginWithEmail({ email, password });
            await refresh();
        },
        [refresh],
    );

    const handleRegister = useCallback(
        async ({ email, password, confirmPassword, name }: RegisterPayload) => {
            await registerWithEmail({ email, password, confirmPassword, name });
            await refresh();
        },
        [refresh],
    );

    const handleLogout = useCallback(async () => {
        await logoutCurrentSession();
        await refresh();
    }, [refresh]);

    const handleGoogleLogin = useCallback(async () => {
        const successRedirect = Linking.createURL("auth-callback");
        const failureRedirect = Linking.createURL("auth-callback?failure=true");

        const authUrl = getOAuthLoginUrl({
            provider: "google",
            success: successRedirect,
            failure: failureRedirect,
            scopes: ["profile", "email"],
        });

        const result = await WebBrowser.openAuthSessionAsync(authUrl, successRedirect);

        if (result.type !== "success" || !result.url) {
            throw new Error("Google login was cancelled.");
        }

        const redirectUrl = new URL(result.url);
        const secret = redirectUrl.searchParams.get("secret");
        const userId = redirectUrl.searchParams.get("userId");

        if (!secret || !userId) {
            throw new Error("Google login failed to return credentials.");
        }

        await createSessionFromOAuthSecret({
            secret,
            userId,
        });

        await refresh();
    }, [refresh]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            initializing,
            refresh,
            login: handleLogin,
            register: handleRegister,
            loginWithGoogle: handleGoogleLogin,
            logout: handleLogout,
        }),
        [user, initializing, refresh, handleLogin, handleRegister, handleGoogleLogin, handleLogout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }

    return context;
};

