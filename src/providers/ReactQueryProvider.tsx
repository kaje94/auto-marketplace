"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const client = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false, retry: false, useErrorBoundary: true },
        mutations: {
            onError: (err) => {
                // Use Sentry to capture mutation exceptions
                if (typeof window !== undefined && (window as any).Sentry) {
                    (window as any).Sentry.captureException(err);
                }
            },
        },
    },
});

export const ReactQueryProvider = ({ children }: React.PropsWithChildren) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
