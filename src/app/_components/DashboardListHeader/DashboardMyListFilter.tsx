"use client";
import clsx from "clsx";
import { FC } from "react";
import ClickAwayListener from "react-click-away-listener";
import { ListingTypeList } from "@/utils/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MyListingsFilterSchema } from "@/utils/schemas";
import { MyListingsFilterReq } from "@/utils/types";
import { useSearchParams } from "next/navigation";
import { searchParamsToObject } from "@/utils/helpers";
import { FilterButton } from "./FilterButton";
import { FilterInput as Input } from "./DashboardFilterInput";
import { FilterSelect as Select } from "./DashboardFilterSelect";
import { useFilter } from "./FilterHooks";

const defaultFilter: MyListingsFilterReq = {
    ListingStatus: "",
    EndCreatedDate: "",
    StartCreatedDate: "",
};

interface Props {
    loadingPage?: boolean;
}

export const DashboardMyListFilter: FC<Props> = ({ loadingPage = false }) => {
    const searchParams = useSearchParams();
    const searchParamsObj = searchParamsToObject(searchParams);
    const hasSearchParams = Object.keys(MyListingsFilterSchema.parse(searchParamsObj)).length > 0;

    const { formState, handleSubmit, register, reset } = useForm<MyListingsFilterReq>({
        resolver: zodResolver(MyListingsFilterSchema),
        defaultValues: searchParamsObj,
        mode: "all",
    });

    const { loading, dropdownOpen, setDropdownOpen, handleFilterOpen, onApplyFilterClick, onResetClick } = useFilter({
        loadingPage,
        reset,
        defaultFilter,
    });

    return (
        <span className={clsx("dropdown-end dropdown flex justify-end ", dropdownOpen && "dropdown-open")}>
            <FilterButton
                loading={loading}
                dropdownOpen={dropdownOpen}
                handleFilterOpen={handleFilterOpen}
                hasSearchParams={hasSearchParams}
                loadingPage={loadingPage}
            />
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
                        <div className="grid max-h-96 grid-cols-1 gap-0.5 overflow-y-auto px-2 py-1 md:max-h-max md:grid-cols-2 md:gap-2 md:px-3">
                            <div className="col-span-full">
                                <Select
                                    label="Status"
                                    options={ListingTypeList}
                                    placeholder="All status types"
                                    selectablePlaceholder
                                    error={formState.errors.ListingStatus?.message}
                                    {...register("ListingStatus")}
                                />{" "}
                            </div>

                            <Input
                                label="Created After"
                                placeholder="Created after date"
                                type="date"
                                error={formState.errors.StartCreatedDate?.message}
                                {...register("StartCreatedDate")}
                            />
                            <Input
                                label="Created Before"
                                placeholder="Created before date"
                                type="date"
                                error={formState.errors.EndCreatedDate?.message}
                                {...register("EndCreatedDate")}
                            />
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
