"use client";
import clsx from "clsx";
import { FC } from "react";
import ClickAwayListener from "react-click-away-listener";
import { FuelTypeList, ListingTypeList, VehicleTypeList } from "@/utils/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import { DashboardListFilterReq } from "@/utils/types";
import { useSearchParams } from "next/navigation";
import { searchParamsToObject } from "@/utils/helpers";
import { FilterInput as InputController } from "./DashboardFilterInput";
import { FilterSelect as SelectController } from "./DashboardFilterSelect";
import { FilterButton } from "./FilterButton";
import { useFilter } from "./FilterHooks";

const defaultFilter: DashboardListFilterReq = {
    Brand: "",
    City: "",
    Condition: "",
    FuelType: "",
    ListingStatus: "",
    MaxPrice: "",
    MinPrice: "",
    Model: "",
    Title: "",
    Transmission: "",
    VehicleType: "",
    EndCreatedDate: "",
    StartCreatedDate: "",
};

export const DashboardAllListFilter: FC = () => {
    const searchParams = useSearchParams();
    const searchParamsObj = searchParamsToObject(searchParams);
    const hasSearchParams = Object.keys(DashboardListingFilterSchema.parse(searchParamsObj)).length > 0;

    const { formState, handleSubmit, register, reset, control } = useForm<DashboardListFilterReq>({
        resolver: zodResolver(DashboardListingFilterSchema),
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
                        <div className="grid max-h-96 grid-cols-1 gap-0.5 overflow-y-auto px-2 py-1 md:max-h-max md:grid-cols-2 md:gap-2 md:px-3">
                            <div className="col-span-full">
                                <InputController label="Title" placeholder="Advert Title" fieldName="Title" control={control} />
                            </div>
                            <SelectController
                                label="Type"
                                options={VehicleTypeList}
                                placeholder="All Types"
                                selectablePlaceholder
                                fieldName="VehicleType"
                                control={control}
                            />
                            <SelectController
                                label="Status"
                                options={ListingTypeList}
                                placeholder="All status types"
                                selectablePlaceholder
                                fieldName="ListingStatus"
                                control={control}
                            />
                            <InputController label="Brand" placeholder="Toyota, Nissan, Honda, etc" fieldName="Brand" control={control} />
                            <InputController label="Model" placeholder="Civic, Sunny, Swift, etc" fieldName="Model" control={control} />
                            <InputController label="Minimum Price" placeholder="Minimum price" type="number" fieldName="MinPrice" control={control} />
                            <InputController label="Maximum Price" placeholder="Maximum price" type="number" fieldName="MaxPrice" control={control} />
                            <InputController
                                label="Created After"
                                placeholder="Created after date"
                                type="date"
                                fieldName="StartCreatedDate"
                                control={control}
                            />
                            <InputController
                                label="Created Before"
                                placeholder="Created before date"
                                type="date"
                                fieldName="EndCreatedDate"
                                control={control}
                            />
                            <InputController label="City" placeholder="Colombo" fieldName="City" control={control} />
                            <SelectController
                                label="Fuel Type"
                                options={FuelTypeList}
                                placeholder="All fuel types"
                                selectablePlaceholder
                                fieldName="FuelType"
                                control={control}
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
