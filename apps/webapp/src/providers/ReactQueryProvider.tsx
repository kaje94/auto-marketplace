"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const client = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false, retry: false, useErrorBoundary: true },
        mutations: {
            onError: () => {
                // TODO: Use Sentry or similar tools to capture mutation exceptions
            },
        },
    },
});

export const ReactQueryProvider = ({ children }: React.PropsWithChildren) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
