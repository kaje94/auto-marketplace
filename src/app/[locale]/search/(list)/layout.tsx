import React from "react";
import { SiteLinkSearchBox } from "@/components/Common/SiteLinkSearchBox";
import { PostedListingsContextProvider } from "@/providers/PostedListingsContextProvider";

export default function Layout(props: { searchFilters: React.ReactNode; searchGrid: React.ReactNode }) {
    return (
        <>
            <SiteLinkSearchBox />
            <div className="container mx-auto p-4 !pt-0 xl:p-7 2xl:p-8">
                <PostedListingsContextProvider>
                    <div>{props.searchFilters}</div>
                    <div>{props.searchGrid}</div>
                </PostedListingsContextProvider>
            </div>
        </>
    );
}
