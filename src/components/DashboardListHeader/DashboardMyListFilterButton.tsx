"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FilterButton } from "@/components/DashboardListHeader/FilterButton";
import { useDashboardFilter } from "@/components/DashboardListHeader/FilterHooks";
import { DashboardMyListFilter } from "@/components/Filters/DashboardMyListFilter";
import { useDashboardMyListingsContext } from "@/providers/DashboardMyListingsContextProvider";
import { MyListingsFilterSchema } from "@/utils/schemas";
import { MyListingsFilterReq, VehicleBrand } from "@/utils/types";

const defaultFilter: MyListingsFilterReq = {
    ListingStatus: "",
    EndCreatedDate: "",
    StartCreatedDate: "",
};

export const DashboardMyListFilterButton = () => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardMyListingsContext();

    const form = useForm<MyListingsFilterReq>({
        resolver: zodResolver(MyListingsFilterSchema),
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
            <DashboardMyListFilter
                dropdownOpen={dropdownOpen}
                form={form}
                hasSearchParams={hasSearchParams}
                isLoading={isLoading}
                onApplyFilterClick={onApplyFilterClick}
                onResetClick={onResetClick}
                setDropdownOpen={setDropdownOpen}
            />
        </div>
    );
};
