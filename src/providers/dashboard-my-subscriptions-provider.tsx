"use client";

import React, { ReactNode, useContext } from "react";
import { DashboardMySubscriptionFilterSchema } from "@/utils/schemas";
import { FiltersContext, useSearchFilters } from "./common";

export const useDashboardMySubscriptionsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

export const DashboardSubscriptionsContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(DashboardMySubscriptionFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};
