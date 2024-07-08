"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FilterButton } from "@/components/Dashboard/DashboardListHeader/FilterButton";
import { useDashboardFilter } from "@/components/Dashboard/DashboardListHeader/FilterHooks";
import { DashboardAllListFilter } from "@/components/Filters/DashboardAllListFilter/DashboardAllListFilter";
import { useDashboardAllListingsContext } from "@/providers/DashboardAllListingsContextProvider";
import { AdminListingsFilterSchema } from "@/utils/schemas";
import { AdminListingsFilterReq } from "@/utils/types";

const defaultFilter: AdminListingsFilterReq = {
    countryCode: "",
    state: "",
    city: "",
    condition: "",
    fuelType: "",
    status: "",
    maxPrice: undefined,
    minPrice: undefined,
    startCreatedDate: "",
    endCreatedDate: "",
    transmissionType: "",
    userEmail: "",
    vehicleType: "",
    yomEndDate: "",
    yomStartDate: "",
    brand: "",
    model: "",
};

/** Filter button to be used in the all advert listing screen within dashboard */
export const DashboardAllListFilterButton = () => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardAllListingsContext();

    const form = useForm<AdminListingsFilterReq>({
        resolver: zodResolver(AdminListingsFilterSchema),
        defaultValues: searchParamsObj,
        mode: "all",
    });

    const { dropdownOpen, setDropdownOpen, handleFilterOpen, onApplyFilterClick, onResetClick } = useDashboardFilter({
        reset: form.reset,
        defaultFilter,
        isLoading,
        newSearchQuery,
        setNewSearchQuery,
        searchParamsObj,
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
                onApplyFilterClick={onApplyFilterClick}
                onResetClick={onResetClick}
            />
        </div>
    );
};
