"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FilterButton } from "@/components/Dashboard/DashboardListHeader/FilterButton";
import { useDashboardFilter } from "@/components/Dashboard/DashboardListHeader/FilterHooks";
import { DashboardAllSubscriptionFilter } from "@/components/Filters/DashboardAllSubscriptionFilter";
import { useDashboardAllSubscriptionsContext } from "@/providers/DashboardAllSubscriptionsProvider";
import { AdminSubscriptionsFilterSchema } from "@/utils/schemas";
import { AdminSubscriptionsFilterReq } from "@/utils/types";

const defaultFilter: AdminSubscriptionsFilterReq = {
    activeStatus: "",
    notificationFrequency: "",
    userEmail: "",
};

/** Filter button to be used in the all subscriptions screen within dashboard */
export const DashboardAllSubscriptionFilterButton = () => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardAllSubscriptionsContext();

    const form = useForm<AdminSubscriptionsFilterReq>({
        resolver: zodResolver(AdminSubscriptionsFilterSchema),
        defaultValues: searchParamsObj,
        mode: "all",
    });

    const { dropdownOpen, setDropdownOpen, handleFilterOpen, onApplyFilterClick, onResetClick } = useDashboardFilter({
        reset: form.reset,
        defaultFilter,
        isLoading,
        newSearchQuery,
        setNewSearchQuery,
        searchParamsObj,
    });

    return (
        <div className="flex flex-col items-end justify-end">
            <FilterButton dropdownOpen={dropdownOpen} handleFilterOpen={handleFilterOpen} hasSearchParams={hasSearchParams} loading={isLoading} />
            <DashboardAllSubscriptionFilter
                dropdownOpen={dropdownOpen}
                form={form}
                hasSearchParams={hasSearchParams}
                isLoading={isLoading}
                setDropdownOpen={setDropdownOpen}
                onApplyFilterClick={onApplyFilterClick}
                onResetClick={onResetClick}
            />
        </div>
    );
};
