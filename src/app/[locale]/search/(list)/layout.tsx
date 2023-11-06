import React from "react";
import { PostedListingsContextProvider } from "@/providers/PostedListingsContextProvider";

export default function Layout(props: { searchFilters: React.ReactNode; searchGrid: React.ReactNode }) {
    return (
        <div className="container mx-auto p-4 !pt-0 xl:p-7 2xl:p-8">
            <PostedListingsContextProvider>
                <div>{props.searchFilters}</div>
                <div>{props.searchGrid}</div>
            </PostedListingsContextProvider>
        </div>
    );
}
