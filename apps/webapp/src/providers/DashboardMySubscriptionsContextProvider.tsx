"use client";

import React, { ReactNode, useContext } from "react";
import { FiltersContext, useSearchFilters } from "@/components/Filters/FiltersContext";
import { UserSubscriptionsFilterSchema } from "@/utils/schemas";

export const useDashboardMySubscriptionsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

/** Provider to be used in my-subscriptions page in the dashboard */
export const DashboardMySubscriptionsContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(UserSubscriptionsFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};
