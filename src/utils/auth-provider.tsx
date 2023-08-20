"use client";

import { SessionProvider } from "next-auth/react";

type Props = {
    children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
    // todo: fix the time after api changes
    return (
        <SessionProvider refetchInterval={4 * 60} refetchOnWindowFocus={false} refetchWhenOffline={false}>
            {children}
        </SessionProvider>
    );
};
