import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import queryString from "query-string";
import React, { createContext, useEffect, useMemo, useState } from "react";

export interface FiltersContextProps {
    hasSearchParams: boolean;
    isLoading: boolean;
    newSearchQuery: string;
    searchParamStr: string;
    searchParamsObj: Record<string, string>;
    setNewSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const defaultFiltersValue: FiltersContextProps = {
    newSearchQuery: "",
    setNewSearchQuery: () => {},
    isLoading: false,
    hasSearchParams: false,
    searchParamsObj: {},
    searchParamStr: "",
};

export const FiltersContext = createContext<FiltersContextProps>(defaultFiltersValue);

const searchParamsToObject = (searchParams: ReadonlyURLSearchParams): Record<string, string> => {
    const searchObject: Record<string, string> = {};

    for (const [key, value] of searchParams.entries()) {
        searchObject[key] = value;
    }

    return searchObject;
};

export const useSearchFilters = () => {
    const searchParams = useSearchParams();
    const searchParamsObj = searchParamsToObject(searchParams);
    const searchParamStr = useMemo(() => queryString.stringify(searchParamsObj), [searchParamsObj]);
    const [newSearchQuery, setNewSearchQuery] = useState(searchParamStr);
    const isLoading = searchParamStr !== newSearchQuery;

    useEffect(() => setNewSearchQuery(searchParamStr), [searchParamStr]);

    return { searchParams, isLoading, searchParamStr, searchParamsObj, newSearchQuery, setNewSearchQuery };
};
