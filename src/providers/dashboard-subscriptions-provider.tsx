"use client";

import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import React, { ReactNode, useContext } from "react";
import { useSearchFilters, FiltersContext } from "./common";

export const useDashboardSubscriptionsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

export const DashboardSubscriptionsContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(DashboardSubscriptionFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};