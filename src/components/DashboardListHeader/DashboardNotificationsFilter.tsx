"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { FC } from "react";
import ClickAwayListener from "react-click-away-listener";
import { useForm } from "react-hook-form";
import { useDashboardMySubscriptionsContext } from "@/providers/dashboard-my-subscriptions-provider";
import { DashboardNotificationsFilterSchema } from "@/utils/schemas";
import { DashboardNotificationsFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "./DashboardFilterInput";
import { FilterSelect as SelectController } from "./DashboardFilterSelect";
import { FilterButton } from "./FilterButton";
import { useDashboardFilter } from "./FilterHooks";

const defaultFilter: DashboardNotificationsFilterReq = {
    StartDate: "",
    EndDate: "",
    IsShown: "",
};

export const DashboardNotificationsFilter: FC = () => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardMySubscriptionsContext();

    const { handleSubmit, reset, control } = useForm<DashboardNotificationsFilterReq>({
        resolver: zodResolver(DashboardNotificationsFilterSchema),
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
                        <div className="grid max-h-96 grid-cols-1 gap-0.5 overflow-y-auto px-2 py-1 md:max-h-max md:grid-cols-2 md:gap-2 md:px-3">
                            <div className="col-span-full">
                                <SelectController
                                    label="Type"
                                    options={[
                                        { label: "Seen notifications", value: "true" },
                                        { label: "New notifications", value: "false" },
                                    ]}
                                    placeholder="All notifications"
                                    control={control}
                                    fieldName="IsShown"
                                />
                            </div>
                            <InputController label="From" placeholder="Notifications from date" type="date" fieldName="StartDate" control={control} />
                            <InputController label="To" placeholder="Notifications to date" type="date" fieldName="EndDate" control={control} />
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
