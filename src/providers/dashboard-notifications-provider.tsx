"use client";

import { DashboardNotificationsFilterSchema } from "@/utils/schemas";
import React, { ReactNode, useContext } from "react";
import { useSearchFilters, FiltersContext } from "./common";

export const useNotificationsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

export const DashboardNotificationsContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(DashboardNotificationsFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};