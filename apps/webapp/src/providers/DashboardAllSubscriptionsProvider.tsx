"use client";

import React, { ReactNode, useContext } from "react";
import { FiltersContext, useSearchFilters } from "@/components/Filters/FiltersContext";
import { AdminSubscriptionsFilterSchema } from "@/utils/schemas";

export const useDashboardAllSubscriptionsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

/** Provider to be used in all-subscriptions page in the dashboard */
export const DashboardAllSubscriptionsProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(AdminSubscriptionsFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};
