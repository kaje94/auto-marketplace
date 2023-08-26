"use client";
import { Input as InputComponent, Props as InputProps } from "@/app/_components/Input";
import { Select as SelectComponent, Props as SelectProps } from "@/app/_components/Select";
import { FilterIcon } from "@/icons";
import clsx from "clsx";
import { FC, forwardRef, useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { FuelTypeList, ListingTypeList, VehicleTypeList } from "@/utils/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import { DashboardListFilterReq } from "@/utils/types";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { searchParamsToObject } from "@/utils/helpers";

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return <InputComponent inputClassNames="input-sm" labelClassNames="pb-0 pt-0.5" {...props} ref={ref} />;
});
Input.displayName = "Input";

const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
    return <SelectComponent selectClassName="select-sm" labelClassName="pb-0 pt-0.5" {...props} ref={ref} />;
});
Select.displayName = "Select";

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

export const DashboardListFilter: FC<Props> = ({ loadingPage = false }) => {
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
        reset(defaultFilter);
        router.push(window?.location?.pathname);
    };

    const onApplyFilterClick = (values: DashboardListFilterReq) => {
        const searchQuery = qs.stringify({ ...searchParamsObj, ...values }, { skipEmptyString: true });
        setDropdownOpen(false);
        if (newSearchQuery !== searchQuery) {
            reset(values);
            setLoading(true);
            setNewSearchQuery(searchQuery);
            router.push(`${window?.location?.pathname}?${searchQuery}`);
        }
    };

    const handleFilterOpen = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        event.preventDefault();
        if (!loading && !loadingPage) {
            reset({ ...defaultFilter, ...searchParamsObj });
            setDropdownOpen(true);
        }
    };

    return (
        <span className={clsx("dropdown-end dropdown flex justify-end ", dropdownOpen && "dropdown-open")}>
            <label className="flex  flex-row items-center gap-2" onClick={handleFilterOpen}>
                {hasSearchParams && <div className={clsx("badge badge-outline badge-md", !loading && "cursor-pointer")}>Filters Applied</div>}
                {loading ? (
                    <span className="loading loading-ring h-8 w-8" />
                ) : (
                    <button
                        className={clsx({
                            "btn-square btn-sm btn": true,
                            "btn-ghost": !hasSearchParams,
                            "btn-neutral": hasSearchParams,
                            "btn-active": dropdownOpen,
                            "animate-pulse": loadingPage,
                        })}
                    >
                        <FilterIcon />
                    </button>
                )}
            </label>
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
