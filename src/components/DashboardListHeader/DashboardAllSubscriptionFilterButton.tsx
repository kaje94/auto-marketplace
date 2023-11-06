"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FilterButton } from "@/components/DashboardListHeader/FilterButton";
import { useDashboardFilter } from "@/components/DashboardListHeader/FilterHooks";
import { DashboardAllSubscriptionFilter } from "@/components/Filters/DashboardAllSubscriptionFilter";
import { useDashboardAllSubscriptionsContext } from "@/providers/DashboardAllSubscriptionsProvider";
import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import { DashboardSubscriptionFilterReq } from "@/utils/types";

const defaultFilter: DashboardSubscriptionFilterReq = {
    Active: "",
    NotificationFrequency: "",
    UserId: "",
};

export const DashboardAllSubscriptionFilterButton = () => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardAllSubscriptionsContext();

    const form = useForm<DashboardSubscriptionFilterReq>({
        resolver: zodResolver(DashboardSubscriptionFilterSchema),
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
                onApplyFilterClick={onApplyFilterClick}
                onResetClick={onResetClick}
                setDropdownOpen={setDropdownOpen}
            />
        </div>
    );
};
