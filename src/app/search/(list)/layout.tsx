import { SearchContextProvider } from "@/providers/search-provider";
import React from "react";

export default function Layout(props: { searchFilters: React.ReactNode; searchGrid: React.ReactNode }) {
    return (
        <div className="container mx-auto p-4 !pt-0 xl:p-7 2xl:p-8">
            <SearchContextProvider>
                <div className="my-10 grid grid-cols-4 gap-4 xl:gap-7 2xl:gap-8">
                    <div className="col-span-4 lg:col-span-1">{props.searchFilters}</div>
                    <div className="col-span-4 lg:col-span-3">{props.searchGrid}</div>
                </div>
            </SearchContextProvider>
        </div>
    );
}
