import type { DefaultSession, NextAuthOptions } from "next-auth";
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6";
import { env } from "@/env.mjs";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

export const authOptions: NextAuthOptions = {
    // callbacks: {
    //     session: ({ session, token }) => {
    //         return { ...session, user: { ...session.user, id: token.sub, accessToken: token.accessToken }, accessToken: token.accessToken };
    //     },
    //     jwt({ token, user, account }) {
    //         if (user) {
    //             token.id = user.id;
    //             token.accessToken = (user as any).accessToken;
    //         }
    //         if (account) {
    //             token.accessToken = account.access_token;
    //         }
    //         return token;
    //     },
    // },
    // providers: [
    //     DuendeIDS6Provider({
    //         clientId: env.IDENTITY_CLIENT_ID,
    //         clientSecret: env.IDENTITY_CLIENT_SECRET,
    //         issuer: env.IDENTITY_BASE_URL,
    //         profile: async (profile, token) => {
    //             const response = await fetch(`${env.IDENTITY_BASE_URL}/connect/userinfo`, {
    //                 headers: { Authorization: `Bearer ${token.access_token!}` },
    //             });
    //             const data: any = await response.json();
    //             return { id: profile.sub, email: data.email, image: "", name: data.name, accessToken: token.access_token };
    //         },
    //     }),
    // ],
    callbacks: {
        session: ({ session, token }) => {
            //   session.user.id = token.id;
            //   session.accessToken = token.accessToken;
            //   return session;

            return { ...session, user: { ...session.user, id: token.sub }, accessToken: token.accessToken };
        },
        jwt({ token, account, user }) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.accessToken = account.access_token;
            }
            // if (account) {
            //     return {
            //         access_token: account.access_token,
            //         expires_at: account.expires_at,
            //         // refresh_token: account.refresh_token,
            //     };
            // }
            return token;
        },
    },
    providers: [
        DuendeIDS6Provider({
            clientId: env.IDENTITY_CLIENT_ID,
            clientSecret: env.IDENTITY_CLIENT_SECRET,
            issuer: env.IDENTITY_BASE_URL,
            profile: async (profile, token) => {
                const response = await fetch(`${env.IDENTITY_BASE_URL}/connect/userinfo`, {
                    headers: { Authorization: `Bearer ${token.access_token!}` },
                });
                const data: any = await response.json();
                return { id: profile.sub, email: data.email, image: "", name: data.name };
            },
        }),
    ],
};
