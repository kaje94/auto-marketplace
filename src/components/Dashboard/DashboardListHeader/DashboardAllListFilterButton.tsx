"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FilterButton } from "@/components/Dashboard/DashboardListHeader/FilterButton";
import { useDashboardFilter } from "@/components/Dashboard/DashboardListHeader/FilterHooks";
import { DashboardAllListFilter } from "@/components/Filters/DashboardAllListFilter/DashboardAllListFilter";
import { useDashboardAllListingsContext } from "@/providers/DashboardAllListingsContextProvider";
import { COUNTRIES } from "@/utils/countries";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import { DashboardListFilterReq, VehicleBrand } from "@/utils/types";

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

/** Filter button to be used in the all advert listing screen within dashboard */
export const DashboardAllListFilterButton = ({ vehicleBrands = [] }: { vehicleBrands?: VehicleBrand[] }) => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardAllListingsContext();

    const selectedCountry = COUNTRIES[searchParamsObj["Country"] || ""];
    const updatedSearchParamsObj = { ...searchParamsObj, Country: selectedCountry?.[0] || "" };
    const form = useForm<DashboardListFilterReq>({
        resolver: zodResolver(DashboardListingFilterSchema),
        defaultValues: updatedSearchParamsObj,
        mode: "all",
    });

    const { dropdownOpen, setDropdownOpen, handleFilterOpen, onApplyFilterClick, onResetClick } = useDashboardFilter({
        reset: form.reset,
        defaultFilter,
        isLoading,
        newSearchQuery,
        setNewSearchQuery,
        searchParamsObj: updatedSearchParamsObj,
    });

    return (
        <div className="flex flex-col items-end justify-end">
            <FilterButton dropdownOpen={dropdownOpen} handleFilterOpen={handleFilterOpen} hasSearchParams={hasSearchParams} loading={isLoading} />
            <DashboardAllListFilter
                dropdownOpen={dropdownOpen}
                form={form}
                hasSearchParams={hasSearchParams}
                isLoading={isLoading}
                setDropdownOpen={setDropdownOpen}
                vehicleBrands={vehicleBrands}
                onApplyFilterClick={onApplyFilterClick}
                onResetClick={onResetClick}
            />
        </div>
    );
};
