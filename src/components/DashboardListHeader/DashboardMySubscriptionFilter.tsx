"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { FC } from "react";
import ClickAwayListener from "react-click-away-listener";
import { useForm } from "react-hook-form";
import { useDashboardMySubscriptionsContext } from "@/providers/dashboard-my-subscriptions-provider";
import { SubscriptFrequenciesList } from "@/utils/constants";
import { DashboardMySubscriptionFilterSchema } from "@/utils/schemas";
import { DashboardMySubscriptionFilterReq } from "@/utils/types";
import { FilterSelect as SelectController } from "./DashboardFilterSelect";
import { FilterButton } from "./FilterButton";
import { useDashboardFilter } from "./FilterHooks";

const defaultFilter: DashboardMySubscriptionFilterReq = {
    Active: "",
    NotificationFrequency: "",
};

export const DashboardMySubscriptionFilter: FC = () => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardMySubscriptionsContext();

    const { handleSubmit, reset, control } = useForm<DashboardMySubscriptionFilterReq>({
        resolver: zodResolver(DashboardMySubscriptionFilterSchema),
        defaultValues: searchParamsObj,
        mode: "all",
    });

    const { dropdownOpen, setDropdownOpen, handleFilterOpen, onApplyFilterClick, onResetClick } = useDashboardFilter({
        reset,
        defaultFilter,
        isLoading,
        newSearchQuery,
        setNewSearchQuery,
        searchParamsObj,
    });

    return (
        <span className={clsx("dropdown-end dropdown flex justify-end ", dropdownOpen && "dropdown-open")}>
            <FilterButton dropdownOpen={dropdownOpen} handleFilterOpen={handleFilterOpen} hasSearchParams={hasSearchParams} loading={isLoading} />
            <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                <ul className="dropdown-content menu rounded-box z-[1] -mr-1 mt-7 w-max !overflow-visible rounded-tr-none border-2 border-base-300 bg-base-200 p-0 shadow-lg md:max-w-md">
                    <form className="flex flex-col">
                        <div className="flex items-center justify-between gap-2 p-2 md:p-3">
                            <div className="text-sm font-semibold">Filters</div>
                            {hasSearchParams && (
                                <button className="btn-accent btn-outline btn-xs btn" disabled={isLoading} onClick={onResetClick}>
                                    Reset Applied Filters
                                </button>
                            )}
                        </div>
                        <div className="grid max-h-96 grid-cols-1 gap-0.5 overflow-y-auto px-2 py-1 md:max-h-max md:gap-2 md:px-3">
                            <SelectController
                                control={control}
                                fieldName="Active"
                                label="Active/Inactive"
                                options={[
                                    { label: "Active", value: "true" },
                                    { label: "Inactive", value: "false" },
                                ]}
                                placeholder="All status types"
                            />
                            <SelectController
                                control={control}
                                fieldName="NotificationFrequency"
                                label="Notification Frequency"
                                options={SubscriptFrequenciesList}
                                placeholder="All frequency types"
                            />
                        </div>
                        <button
                            className="btn-neutral btn-wide btn-sm btn mx-2 mb-3 mt-6 place-self-center"
                            disabled={isLoading}
                            onClick={handleSubmit(onApplyFilterClick)}
                        >
                            {isLoading ? "Applying Filters..." : "Apply Filters"}
                        </button>
                    </form>
                </ul>
            </ClickAwayListener>
        </span>
    );
};
