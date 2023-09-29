"use client";
import clsx from "clsx";
import { FC } from "react";
import ClickAwayListener from "react-click-away-listener";
import { SubscriptFrequenciesList } from "@/utils/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import { DashboardSubscriptionFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "./DashboardFilterInput";
import { FilterSelect as SelectController } from "./DashboardFilterSelect";
import { FilterButton } from "./FilterButton";
import { useDashboardFilter } from "./FilterHooks";
import { useDashboardSubscriptionsContext } from "@/providers/dashboard-subscriptions-provider";

const defaultFilter: DashboardSubscriptionFilterReq = {
    Active: "",
    NotificationFrequency: "",
    UserId: "",
};

export const DashboardAllSubscriptionFilter: FC = () => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardSubscriptionsContext();

    const { handleSubmit, reset, control } = useForm<DashboardSubscriptionFilterReq>({
        resolver: zodResolver(DashboardSubscriptionFilterSchema),
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
            <FilterButton loading={isLoading} dropdownOpen={dropdownOpen} handleFilterOpen={handleFilterOpen} hasSearchParams={hasSearchParams} />
            <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                <ul className="dropdown-content menu rounded-box z-[1] -mr-1 mt-7 w-max !overflow-visible rounded-tr-none border-2 border-base-300 bg-base-200 p-0 shadow-lg md:max-w-md">
                    <form className="flex flex-col">
                        <div className="flex items-center justify-between gap-2 p-2 md:p-3">
                            <div className="text-sm font-semibold">Filters</div>
                            {hasSearchParams && (
                                <button disabled={isLoading} className="btn-accent btn-outline btn-xs btn" onClick={onResetClick}>
                                    Reset Applied Filters
                                </button>
                            )}
                        </div>
                        <div className="grid max-h-96 grid-cols-1 gap-0.5 overflow-y-auto px-2 py-1 md:max-h-max md:gap-2 md:px-3">
                            <SelectController
                                label="Active/Inactive"
                                options={[
                                    { label: "Active", value: "true" },
                                    { label: "Inactive", value: "false" },
                                ]}
                                placeholder="All status types"
                                control={control}
                                fieldName="Active"
                            />
                            <SelectController
                                label="Notification Frequency"
                                options={SubscriptFrequenciesList}
                                placeholder="All frequency types"
                                control={control}
                                fieldName="NotificationFrequency"
                            />
                            <InputController label="User ID" placeholder="ID of the user" fieldName="UserId" control={control} />
                        </div>
                        <button
                            className="btn-neutral btn-wide btn-sm btn mx-2 mb-3 mt-6 place-self-center"
                            onClick={handleSubmit(onApplyFilterClick)}
                            disabled={isLoading}
                        >
                            {isLoading ? "Applying Filters..." : "Apply Filters"}
                        </button>
                    </form>
                </ul>
            </ClickAwayListener>
        </span>
    );
};
