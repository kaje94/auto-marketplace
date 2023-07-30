"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const client = new QueryClient();

export const ReactQueryProvider = ({ children }: React.PropsWithChildren) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
