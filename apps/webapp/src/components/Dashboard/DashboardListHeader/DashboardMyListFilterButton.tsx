"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GetStatesResponse_StateItem } from "targabay-protos/gen/ts/dist/types/locations_pb";
import { FilterButton } from "@/components/Dashboard/DashboardListHeader/FilterButton";
import { useDashboardFilter } from "@/components/Dashboard/DashboardListHeader/FilterHooks";
import { DashboardMyListFilter } from "@/components/Filters/DashboardMyListFilter";
import { useDashboardMyListingsContext } from "@/providers/DashboardMyListingsContextProvider";
import { UserListingsFilterSchema } from "@/utils/schemas";
import { UserListingsFilterReq } from "@/utils/types";

const defaultFilter: UserListingsFilterReq = {
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
    vehicleType: "",
    yomEndDate: "",
    yomStartDate: "",
    brand: "",
    model: "",
};

/** Filter button to be used in the my advert listing screen within dashboard */
export const DashboardMyListFilterButton = ({ states = [], countryCode }: { countryCode: string; states: GetStatesResponse_StateItem[] }) => {
    const { hasSearchParams, searchParamsObj, isLoading, newSearchQuery, setNewSearchQuery } = useDashboardMyListingsContext();

    const form = useForm<UserListingsFilterReq>({
        resolver: zodResolver(UserListingsFilterSchema),
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
                countryCode={countryCode}
                dropdownOpen={dropdownOpen}
                form={form}
                hasSearchParams={hasSearchParams}
                isLoading={isLoading}
                setDropdownOpen={setDropdownOpen}
                states={states}
                onApplyFilterClick={onApplyFilterClick}
                onResetClick={onResetClick}
            />
        </div>
    );
};
