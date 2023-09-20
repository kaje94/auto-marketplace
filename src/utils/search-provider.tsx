"use client";

import { useSearchParams } from "next/navigation";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { PostedListingsFilterSchema } from "./schemas";
import { searchParamsToObject } from "./helpers";

interface SearchContextProps {
    newSearchQuery: string;
    setNewSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    hasSearchParams: boolean;
    searchParamsObj: Record<string, string>;
}

export const SearchContext = React.createContext<SearchContextProps>({
    newSearchQuery: "",
    setNewSearchQuery: () => {},
    isLoading: false,
    hasSearchParams: false,
    searchParamsObj: {},
});

export const useSearchContext = () => {
    const data = useContext(SearchContext);

    return data;
};

export const SearchContextProvider = ({ children }: { children: ReactNode }) => {
    const searchParams = useSearchParams();
    const searchParamStr = searchParams.toString();
    const searchParamsObj = searchParamsToObject(searchParams);
    const hasSearchParams = Object.keys(PostedListingsFilterSchema.parse(searchParamsObj)).length > 0;
    const [newSearchQuery, setNewSearchQuery] = useState(searchParams.toString());
    const isLoading = searchParams.toString() !== newSearchQuery;

    useEffect(() => {
        setNewSearchQuery(searchParamStr);
    }, [searchParamStr]);

    return (
        <SearchContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams }}>
            {children}
        </SearchContext.Provider>
    );
};
