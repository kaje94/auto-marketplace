"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { FC } from "react";
import ClickAwayListener from "react-click-away-listener";
import { useForm } from "react-hook-form";
import { getCitiesOfState, getStatesOfCountry } from "@/actions/localtionActions";
import { useDashboardListingsContext } from "@/providers/dashboard-listings-provider";
import { FuelTypeList, ListingTypeList, VehicleTypeList } from "@/utils/constants";
import { COUNTRIES } from "@/utils/countries";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import { DashboardListFilterReq, LabelValue, UpdateProfileReq, VehicleBrand } from "@/utils/types";
import { FilterAutoComplete as AutocompleteController } from "./DashboardFilterAutoComplete";
import { FilterInput as InputController } from "./DashboardFilterInput";
import { FilterSelect as SelectController } from "./DashboardFilterSelect";
import { FilterButton } from "./FilterButton";
import { useDashboardFilter } from "./FilterHooks";

const defaultFilter: DashboardListFilterReq = {
    Brand: "",
    City: "",
    Country: "",
    State: "",
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

export const DashboardAllListFilter: FC<{ vehicleBrands?: VehicleBrand[] }> = ({ vehicleBrands = [] }) => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardListingsContext();

    const { handleSubmit, reset, control, watch, setValue } = useForm<DashboardListFilterReq>({
        resolver: zodResolver(DashboardListingFilterSchema),
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

    const country = watch("Country");
    const state = watch("State");
    const city = watch("City");

    const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === country);

    const countryList: LabelValue[] = Object.keys(COUNTRIES).map((key) => ({
        label: COUNTRIES[key]?.[0]!,
        value: COUNTRIES[key]?.[0]!,
    }));

    const {
        data: states = [],
        isFetching: isLoadingStates,
        isError: stateFetchError,
    } = useQuery({
        queryFn: () => getStatesOfCountry(countryCode!),
        enabled: !!countryCode,
        queryKey: ["country-states", { locale: countryCode }],
        onSettled: (data, _) => {
            if (!!data?.length && !data?.some((item) => item.name === state)) {
                setValue("State", "");
                setValue("City", "");
            }
        },
    });

    const stateList = states?.map((item) => ({ label: item.name, value: item.name }) as LabelValue);

    const stateCode = states.find((item) => item.name === state)?.stateCode;

    const {
        data: cityList = [],
        isFetching: isLoadingCities,
        isError: cityFetchError,
    } = useQuery({
        queryFn: () => getCitiesOfState(countryCode!, stateCode!),
        enabled: !!countryCode && !!stateCode,
        queryKey: ["country-state-cities", { locale: countryCode, stateCode }],
        select: (data) => data.map((item) => ({ label: item.name, value: item.name }) as LabelValue),
        onSettled: (data, _) => {
            if (!!data?.length && !data?.some((item) => item.label === city)) {
                setValue("City", "");
            }
        },
    });

    return (
        <span className={clsx("dropdown-end dropdown flex justify-end ", dropdownOpen && "dropdown-open")}>
            <FilterButton dropdownOpen={dropdownOpen} handleFilterOpen={handleFilterOpen} hasSearchParams={hasSearchParams} loading={isLoading} />
            <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                <div className="menu dropdown-content rounded-box z-[1] -mr-1 mt-7 w-max !overflow-visible rounded-tr-none border-2 border-base-300 bg-base-200 p-0 shadow-lg md:max-w-md">
                    <form className="flex flex-col">
                        <div className="flex items-center justify-between gap-2 p-2 md:p-3">
                            <div className="text-sm font-semibold">Filters</div>
                            {hasSearchParams && (
                                <button className="btn btn-accent btn-outline btn-xs" disabled={isLoading} onClick={onResetClick}>
                                    Reset Applied Filters
                                </button>
                            )}
                        </div>
                        <div className="grid max-h-96 grid-cols-1 gap-0.5 overflow-y-auto px-2 py-1 md:max-h-max md:grid-cols-2 md:gap-2 md:px-3">
                            <div className="col-span-full">
                                <InputController control={control} fieldName="Title" label="Title" placeholder="Advert Title" />
                            </div>

                            <AutocompleteController
                                control={control}
                                fieldName="Country"
                                label="Country"
                                options={countryList}
                                placeholder="Select Country"
                            />

                            {stateList?.length > 0 && !stateFetchError ? (
                                <AutocompleteController
                                    control={control}
                                    fieldName="State"
                                    label="State/Province"
                                    loading={isLoadingStates}
                                    options={stateList}
                                    placeholder="Select State"
                                />
                            ) : (
                                <InputController
                                    control={control}
                                    fieldName="State"
                                    label="State/Province"
                                    loading={isLoading}
                                    placeholder="State or Province"
                                />
                            )}

                            {cityList.length > 0 && !cityFetchError ? (
                                <AutocompleteController
                                    control={control}
                                    fieldName="City"
                                    label="City"
                                    loading={isLoadingCities}
                                    options={cityList}
                                    placeholder="Select City"
                                />
                            ) : (
                                <InputController control={control} fieldName="City" label="City" loading={isLoading} placeholder="City" />
                            )}

                            <AutocompleteController
                                control={control}
                                fieldName="Brand"
                                label="Brand"
                                options={vehicleBrands.map((item) => ({ label: item.name, value: item.name }))}
                                placeholder="Toyota, Nissan, Honda, etc"
                            />

                            <InputController control={control} fieldName="Model" label="Model" placeholder="Civic, Sunny, Swift, etc" />

                            <SelectController
                                control={control}
                                fieldName="ListingStatus"
                                label="Status"
                                options={ListingTypeList}
                                placeholder="All status types"
                            />

                            <InputController control={control} fieldName="MinPrice" label="Minimum Price" placeholder="Minimum price" type="number" />

                            <InputController control={control} fieldName="MaxPrice" label="Maximum Price" placeholder="Maximum price" type="number" />

                            <InputController
                                control={control}
                                fieldName="StartCreatedDate"
                                label="Created After"
                                placeholder="Created after date"
                                type="date"
                            />

                            <InputController
                                control={control}
                                fieldName="EndCreatedDate"
                                label="Created Before"
                                placeholder="Created before date"
                                type="date"
                            />

                            <SelectController
                                control={control}
                                fieldName="VehicleType"
                                label="Vehicle Type"
                                options={VehicleTypeList}
                                placeholder="All Types"
                            />

                            <SelectController
                                control={control}
                                fieldName="FuelType"
                                label="Fuel Type"
                                options={FuelTypeList}
                                placeholder="All fuel types"
                            />
                        </div>
                        <button
                            className="btn btn-neutral btn-sm btn-wide mx-2 mb-3 mt-6 place-self-center"
                            disabled={isLoading}
                            onClick={handleSubmit(onApplyFilterClick)}
                        >
                            {isLoading ? "Applying Filters..." : "Apply Filters"}
                        </button>
                    </form>
                </div>
            </ClickAwayListener>
        </span>
    );
};
