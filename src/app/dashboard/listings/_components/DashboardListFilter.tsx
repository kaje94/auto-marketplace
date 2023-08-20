"use client";
import { Input, Select } from "@/app/_components";
import { FilterIcon } from "@/icons";
import clsx from "clsx";
import { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { FuelTypeList, ListingTypeList, VehicleTypeList } from "@/utils/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import { DashboardListFilterReq } from "@/utils/types";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { searchParamsToObject } from "@/utils/helpers";

export const DashboardListFilter = () => {
    // todo: use this approach for all other dropdowns and modals
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchParamsObj = searchParamsToObject(searchParams);
    const [newSearchQuery, setNewSearchQuery] = useState(searchParams.toString());
    const hasSearchParams = Object.keys(DashboardListingFilterSchema.parse(searchParamsObj)).length > 0;

    const { formState, handleSubmit, register, reset } = useForm<DashboardListFilterReq>({
        resolver: zodResolver(DashboardListingFilterSchema),
        defaultValues: searchParamsObj,
        mode: "all",
    });

    useEffect(() => {
        if (searchParams.toString() === newSearchQuery) {
            setLoading(false);
        }
    }, [searchParams, newSearchQuery, setLoading]);

    const onResetClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setLoading(true);
        setDropdownOpen(false);
        setNewSearchQuery("");
        reset({
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
        });
        router.push(`/dashboard/listings`);
    };

    const onApplyFilterClick = (values: DashboardListFilterReq) => {
        const searchQuery = qs.stringify({ ...searchParamsObj, ...values }, { skipEmptyString: true });
        setDropdownOpen(false);
        if (newSearchQuery !== searchQuery) {
            reset(values);
            setLoading(true);
            setNewSearchQuery(searchQuery);
            router.push(`/dashboard/listings?${searchQuery}`);
        }
    };

    const handleFilterOpen = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        event.preventDefault();
        if (!loading) {
            setDropdownOpen(true);
        }
    };

    return (
        <div className="mb-3 flex flex-col">
            <div className={clsx("dropdown-end dropdown mb-2 flex w-full justify-end ", dropdownOpen && "dropdown-open")}>
                <label className="h-6" onClick={handleFilterOpen}>
                    {loading ? (
                        <span className="loading loading-ring loading-md" />
                    ) : (
                        <FilterIcon
                            className={clsx({
                                "cursor-pointer transition-all duration-200 hover:opacity-75": true,
                                "opacity-90": dropdownOpen,
                                "fill-neutral opacity-90": hasSearchParams,
                                "opacity-50": !dropdownOpen || !hasSearchParams,
                            })}
                        />
                    )}
                </label>
                <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                    <ul className="dropdown-content menu rounded-box z-[1] -mr-1 mt-7 max-w-xs !overflow-visible rounded-tr-none border-2 border-base-300 bg-base-200 p-0 shadow-lg md:max-w-md">
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
                                    <Input
                                        label="Title"
                                        placeholder="Advert Title"
                                        inputClassNames="input-sm"
                                        labelClassNames="pb-0 pt-0.5"
                                        error={formState.errors.Title?.message}
                                        {...register("Title")}
                                    />
                                </div>
                                <Select
                                    label="Type"
                                    options={VehicleTypeList}
                                    selectClassName="select-sm"
                                    labelClassName="pb-0 pt-0.5"
                                    placeholder="All Types"
                                    selectablePlaceholder
                                    error={formState.errors.VehicleType?.message}
                                    {...register("VehicleType")}
                                />
                                <Select
                                    label="Status"
                                    options={ListingTypeList}
                                    selectClassName="select-sm"
                                    labelClassName="pb-0 pt-0.5"
                                    placeholder="All status types"
                                    selectablePlaceholder
                                    error={formState.errors.ListingStatus?.message}
                                    {...register("ListingStatus")}
                                />
                                <Input
                                    label="Brand"
                                    placeholder="Toyota, Nissan, Honda, etc"
                                    inputClassNames="input-sm"
                                    labelClassNames="pb-0 pt-0.5"
                                    error={formState.errors.Brand?.message}
                                    {...register("Brand")}
                                />
                                <Input
                                    label="Model"
                                    placeholder="Civic, Sunny, Swift, etc"
                                    inputClassNames="input-sm"
                                    labelClassNames="pb-0 pt-0.5"
                                    error={formState.errors.Model?.message}
                                    {...register("Model")}
                                />
                                <Input
                                    label="Minimum Price"
                                    placeholder="Minimum price"
                                    type="number"
                                    inputClassNames="input-sm"
                                    labelClassNames="pb-0 pt-0.5"
                                    error={formState.errors.MinPrice?.message}
                                    {...register("MinPrice")}
                                />
                                <Input
                                    label="Maximum Price"
                                    placeholder="Maximum price"
                                    type="number"
                                    inputClassNames="input-sm"
                                    labelClassNames="pb-0 pt-0.5"
                                    error={formState.errors.MaxPrice?.message}
                                    {...register("MaxPrice")}
                                />
                                <Input
                                    label="Created After"
                                    placeholder="Created after date"
                                    type="date"
                                    inputClassNames="input-sm"
                                    labelClassNames="pb-0 pt-0.5"
                                    error={formState.errors.StartCreatedDate?.message}
                                    {...register("StartCreatedDate")}
                                />
                                <Input
                                    label="Created Before"
                                    placeholder="Created before date"
                                    type="date"
                                    inputClassNames="input-sm"
                                    labelClassNames="pb-0 pt-0.5"
                                    error={formState.errors.EndCreatedDate?.message}
                                    {...register("EndCreatedDate")}
                                />
                                <Input
                                    label="City"
                                    placeholder="Colombo"
                                    inputClassNames="input-sm"
                                    labelClassNames="pb-0 pt-0.5"
                                    error={formState.errors.City?.message}
                                    {...register("City")}
                                />
                                <Select
                                    label="Fuel Type"
                                    options={FuelTypeList}
                                    selectClassName="select-sm"
                                    labelClassName="pb-0 pt-0.5"
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
            </div>
        </div>
    );
};
