import type { DefaultSession, NextAuthOptions } from "next-auth";
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6";
import { env } from "@/env.mjs";
import { redirect } from "next/navigation";
import { headers as nextHeaders } from "next/headers";

declare module "next-auth" {
    interface User {
        isAdmin: boolean;
    }
    interface Session {
        user: {
            id: string;
            isAdmin: boolean;
        } & DefaultSession["user"];
        access_token?: string;
        expires_at?: number;
        error: "RefreshAccessTokenError";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        access_token?: string;
        expires_at?: number;
        refresh_token?: string;
        isAdmin: boolean;
    }
}

interface TokenSet {
    access_token: string;
    expires_in: number;
    refresh_token: string;
}

interface UserInfoResponse {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    preferred_username: string;
    name: string;
    email_verified: boolean;
}

export const authOptions: NextAuthOptions = {
    pages: { signIn: "/auth/login" },
    callbacks: {
        async jwt({ token, account, user, profile }) {
            if (user) {
                token.isAdmin = user.isAdmin;
            }

            if (user) {
                token.id = user.id;
            }

            if (account) {
                token.access_token = account.access_token;
                token.refresh_token = account.refresh_token;
                token.expires_at = account.expires_at;
                return token;
                // todo: revisit this
            }

            if (token?.expires_at && Date.now() < token?.expires_at * 1000) {
                // If the access token has not expired yet, return it
                return token;
            } else if (token?.refresh_token) {
                try {
                    console.log("trying to refresh using ", token?.refresh_token);
                    const response = await fetch(`${env.IDENTITY_BASE_URL}/connect/token`, {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({
                            client_id: env.IDENTITY_CLIENT_ID,
                            client_secret: env.IDENTITY_CLIENT_SECRET,
                            grant_type: "refresh_token",
                            refresh_token: token?.refresh_token as string,
                        }),
                        method: "POST",
                    });

                    const tokens: TokenSet = await response.json();
                    if (!response.ok) throw tokens;
                    console.log("successfully refreshed", tokens);
                    return {
                        ...token, // Keep the previous token properties
                        error: "",
                        access_token: tokens.access_token,
                        expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
                        // Fall back to old refresh token, but note that
                        // many providers may only allow using a refresh token once.
                        refresh_token: tokens.refresh_token,
                    };
                } catch (error) {
                    console.error("Error refreshing access token", error);
                    // The error property will be used client-side to handle the refresh token error
                    return { ...token, error: "RefreshAccessTokenError" as const, refresh_token: "" };
                }
            } else {
                return { ...token, error: "RefreshAccessTokenError" as const, refresh_token: "" };
            }
        },
        async session({ session, token, user }) {
            if (token && session?.user) {
                session.user.isAdmin = token.isAdmin;
            }
            return {
                ...session,
                user: { ...session.user, id: token.sub, isAdmin: session?.user?.isAdmin },
                access_token: token.access_token,
                error: token.error,
                expires_at: token.expires_at,
            };
        },
    },
    providers: [
        DuendeIDS6Provider({
            clientId: env.IDENTITY_CLIENT_ID,
            clientSecret: env.IDENTITY_CLIENT_SECRET,
            issuer: env.IDENTITY_BASE_URL,
            authorization: { params: { scope: "openid email profile offline_access" } },
            profile: async (profile, token) => {
                const response = await fetch(`${env.IDENTITY_BASE_URL}/connect/userinfo`, {
                    headers: { Authorization: `Bearer ${token.access_token!}` },
                });
                const data: UserInfoResponse = await response.json();
                return { id: profile.sub, email: data.email, image: "", name: data.name, isAdmin: data.email === "administrator@autostore.com" };
            },
        }),
    ],
};

export const redirectToLoginPage = () => {
    if (nextHeaders().get("x-invoke-path")) {
        return redirect(`${authOptions.pages?.signIn}?callbackUrl=${nextHeaders().get("x-invoke-path")}`);
    } else {
        return redirect(`${authOptions.pages?.signIn}`);
    }
};
