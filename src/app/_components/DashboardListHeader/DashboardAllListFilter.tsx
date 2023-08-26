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
import { FilterInput as Input } from "./DashboardFilterInput";
import { FilterSelect as Select } from "./DashboardFilterSelect";
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

interface Props {
    loadingPage?: boolean;
}

export const DashboardAllListFilter: FC<Props> = ({ loadingPage = false }) => {
    const searchParams = useSearchParams();
    const searchParamsObj = searchParamsToObject(searchParams);
    const hasSearchParams = Object.keys(DashboardListingFilterSchema.parse(searchParamsObj)).length > 0;

    const { formState, handleSubmit, register, reset } = useForm<DashboardListFilterReq>({
        resolver: zodResolver(DashboardListingFilterSchema),
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
                                <Input label="Title" placeholder="Advert Title" error={formState.errors.Title?.message} {...register("Title")} />
                            </div>
                            <Select
                                label="Type"
                                options={VehicleTypeList}
                                placeholder="All Types"
                                selectablePlaceholder
                                error={formState.errors.VehicleType?.message}
                                {...register("VehicleType")}
                            />
                            <Select
                                label="Status"
                                options={ListingTypeList}
                                placeholder="All status types"
                                selectablePlaceholder
                                error={formState.errors.ListingStatus?.message}
                                {...register("ListingStatus")}
                            />
                            <Input
                                label="Brand"
                                placeholder="Toyota, Nissan, Honda, etc"
                                error={formState.errors.Brand?.message}
                                {...register("Brand")}
                            />
                            <Input
                                label="Model"
                                placeholder="Civic, Sunny, Swift, etc"
                                error={formState.errors.Model?.message}
                                {...register("Model")}
                            />
                            <Input
                                label="Minimum Price"
                                placeholder="Minimum price"
                                type="number"
                                error={formState.errors.MinPrice?.message}
                                {...register("MinPrice")}
                            />
                            <Input
                                label="Maximum Price"
                                placeholder="Maximum price"
                                type="number"
                                error={formState.errors.MaxPrice?.message}
                                {...register("MaxPrice")}
                            />
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
                            <Input label="City" placeholder="Colombo" error={formState.errors.City?.message} {...register("City")} />
                            <Select
                                label="Fuel Type"
                                options={FuelTypeList}
                                placeholder="All fuel types"
                                selectablePlaceholder
                                error={formState.errors.FuelType?.message}
                                {...register("FuelType")}
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
