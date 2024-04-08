"use client";

import React, { ReactNode, useContext } from "react";
import { FiltersContext, useSearchFilters } from "@/components/Filters/FiltersContext";
import { AdminListingsFilterSchema } from "@/utils/schemas";

export const useDashboardAllListingsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

/** Provider to be used in all-advert-listing page in the dashboard */
export const DashboardAllListingsContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(AdminListingsFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};
