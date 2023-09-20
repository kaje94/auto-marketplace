import React from "react";
import { SearchContextProvider } from "@/utils/search-provider";

// todo: follow this naming convention throughout
export default function Layout(props: { children: React.ReactNode }) {
    return <div className="container mx-auto min-h-screen p-4 !pt-0 xl:p-7 2xl:p-8">{props.children}</div>;
}
