"use client";

import React, { ReactNode, useContext } from "react";
import { FiltersContext, useSearchFilters } from "@/components/Filters/FiltersContext";
import { UserNotificationsFilterSchema } from "@/utils/schemas";

export const useNotificationsContext = () => {
    const data = useContext(FiltersContext);
    return data;
};

/** Provider to be used in my-notifications page in the dashboard */
export const DashboardNotificationsContextProvider = ({ children }: { children: ReactNode }) => {
    const { searchParamsObj, newSearchQuery, isLoading, setNewSearchQuery, searchParamStr } = useSearchFilters();
    const hasSearchParams = Object.keys(UserNotificationsFilterSchema.parse(searchParamsObj)).length > 0;

    return (
        <FiltersContext.Provider value={{ newSearchQuery, isLoading, setNewSearchQuery, searchParamsObj, hasSearchParams, searchParamStr }}>
            {children}
        </FiltersContext.Provider>
    );
};
