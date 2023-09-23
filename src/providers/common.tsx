import { searchParamsToObject } from "@/utils/helpers";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

export interface FiltersContextProps {
    newSearchQuery: string;
    setNewSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    hasSearchParams: boolean;
    searchParamsObj: Record<string, string>;
    searchParamStr: string;
}

export const defaultFiltersValue: FiltersContextProps = {
    newSearchQuery: "",
    setNewSearchQuery: () => {},
    isLoading: false,
    hasSearchParams: false,
    searchParamsObj: {},
    searchParamStr: "",
};

export const FiltersContext = React.createContext<FiltersContextProps>(defaultFiltersValue);

export const useSearchFilters = () => {
    const searchParams = useSearchParams();
    const searchParamStr = useMemo(() => searchParams.toString(), [searchParams]);
    const searchParamsObj = searchParamsToObject(searchParams);
    const [newSearchQuery, setNewSearchQuery] = useState(searchParamStr);
    const isLoading = searchParamStr !== newSearchQuery;

    return { searchParams, isLoading, searchParamStr, searchParamsObj, newSearchQuery, setNewSearchQuery };
};
