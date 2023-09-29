"use client";

import React, { ReactNode, useContext } from "react";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import { FiltersContext, useSearchFilters } from "./common";

export const useDashboardListingsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

export const DashboardListingsContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(DashboardListingFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};
