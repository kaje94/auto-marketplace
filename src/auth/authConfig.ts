import type { NextAuthOptions } from "next-auth";
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6";
import { env } from "@/env.mjs";

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
            return { ...session, user: { ...session.user, id: token.sub } };
        },
        jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
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
