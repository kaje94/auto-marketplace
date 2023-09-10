"use client";
import clsx from "clsx";
import { FC } from "react";
import ClickAwayListener from "react-click-away-listener";
import { SubscriptFrequenciesList } from "@/utils/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import { DashboardSubscriptionFilterReq } from "@/utils/types";
import { useSearchParams } from "next/navigation";
import { searchParamsToObject } from "@/utils/helpers";
import { FilterInput as Input } from "./DashboardFilterInput";
import { FilterSelect as Select } from "./DashboardFilterSelect";
import { FilterButton } from "./FilterButton";
import { useFilter } from "./FilterHooks";

const defaultFilter: DashboardSubscriptionFilterReq = {
    Active: "",
    NotificationFrequency: "",
    UserId: "",
};

export const DashboardAllSubscriptionFilter: FC = () => {
    const searchParams = useSearchParams();
    const searchParamsObj = searchParamsToObject(searchParams);
    const hasSearchParams = Object.keys(DashboardSubscriptionFilterSchema.parse(searchParamsObj)).length > 0;

    const { formState, handleSubmit, register, reset } = useForm<DashboardSubscriptionFilterReq>({
        resolver: zodResolver(DashboardSubscriptionFilterSchema),
        defaultValues: searchParamsObj,
        mode: "all",
    });

    const { loading, dropdownOpen, setDropdownOpen, handleFilterOpen, onApplyFilterClick, onResetClick } = useFilter({
        reset,
        defaultFilter,
    });

    return (
        <span className={clsx("dropdown-end dropdown flex justify-end ", dropdownOpen && "dropdown-open")}>
            <FilterButton loading={loading} dropdownOpen={dropdownOpen} handleFilterOpen={handleFilterOpen} hasSearchParams={hasSearchParams} />
            <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                <ul className="dropdown-content menu rounded-box z-[1] -mr-1 mt-7 w-max !overflow-visible rounded-tr-none border-2 border-base-300 bg-base-200 p-0 shadow-lg md:max-w-md">
                    <form className="flex flex-col">
                        <div className="flex items-center justify-between gap-2 p-2 md:p-3">
                            <div className="text-sm font-semibold">Filters</div>
                            {hasSearchParams && (
                                <button disabled={loading} className="btn-accent btn-outline btn-xs btn" onClick={onResetClick}>
                                    Reset Applied Filters
                                </button>
                            )}
                        </div>
                        <div className="grid max-h-96 grid-cols-1 gap-0.5 overflow-y-auto px-2 py-1 md:max-h-max md:gap-2 md:px-3">
                            <Select
                                label="Active/Inactive"
                                options={[
                                    { label: "Active", value: "true" },
                                    { label: "Inactive", value: "false" },
                                ]}
                                placeholder="All status types"
                                selectablePlaceholder
                                error={formState.errors.Active?.message}
                                {...register("Active")}
                            />
                            <Select
                                label="Notification Frequency"
                                options={SubscriptFrequenciesList}
                                placeholder="All frequency types"
                                selectablePlaceholder
                                error={formState.errors.NotificationFrequency?.message}
                                {...register("NotificationFrequency")}
                            />
                            <Input label="User ID" placeholder="ID of the user" error={formState.errors.UserId?.message} {...register("UserId")} />
                        </div>
                        <button
                            className="btn-neutral btn-wide btn-sm btn mx-2 mb-3 mt-6 place-self-center"
                            onClick={handleSubmit(onApplyFilterClick)}
                            disabled={loading}
                        >
                            {loading ? "Applying Filters..." : "Apply Filters"}
                        </button>
                    </form>
                </ul>
            </ClickAwayListener>
        </span>
    );
};
