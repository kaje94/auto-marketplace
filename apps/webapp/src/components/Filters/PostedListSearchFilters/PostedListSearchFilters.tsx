import { useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams } from "next/navigation";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { GetStatesResponse_StateItem } from "targabay-protos/gen/ts/dist/types/locations_pb";
import { getCitiesOfState } from "@/actions/locationActions";
import { FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList, YearSelectMinYear } from "@/utils/constants";
import { LabelValue, PublicListingsFilterReq } from "@/utils/types";
import { FilterAutoComplete as AutocompleteController } from "../FilterFormElements/DashboardFilterAutoComplete";
import { FilterInput as InputController } from "../FilterFormElements/DashboardFilterInput";
import { FilterNumberInput as NumberInputController } from "../FilterFormElements/DashboardFilterNumberInput";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    countryCode?: string;
    defaultFilter: PublicListingsFilterReq;
    dropdownOpen: boolean;
    form?: UseFormReturn<PublicListingsFilterReq>;
    hasFilters?: boolean;
    isLoading?: boolean;
    onApplyFilterClick?: (values: PublicListingsFilterReq) => void;
    searchParams?: ReadonlyURLSearchParams;
    setDropdownOpen: (open: boolean) => void;
    states?: GetStatesResponse_StateItem[];
}

export const PostedListSearchFilters: FC<Props> = ({
    dropdownOpen,
    setDropdownOpen,
    hasFilters,
    isLoading,
    states,
    form,
    onApplyFilterClick,
    countryCode,
    searchParams,
    defaultFilter,
}) => {
    const {
        handleSubmit,
        control,
        watch = (_: string) => "",
        setValue = (_key: string, _value: string) => null,
    } = form as UseFormReturn<PublicListingsFilterReq>;

    const state = watch("state");
    const city = watch("city");

    const stateList = states?.map((item) => ({ label: item.stateName, value: item.stateName }) as LabelValue);

    const stateCode = states?.find((item) => item.stateName === state)?.id;

    const { data: cityList = [], isFetching: isLoadingCities } = useQuery({
        queryFn: () => getCitiesOfState(stateCode!),
        enabled: !!countryCode && !!stateCode,
        queryKey: ["country-state-cities", { locale: countryCode, stateCode }],
        select: (data) => data?.cities?.map((item) => ({ label: item, value: item }) as LabelValue),
        onSettled: (data, _) => {
            if (!!data?.length && !data?.some((item) => item.label === city)) {
                setValue("city", "");
            }
        },
    });

    return (
        <FilterWrap
            dropdownOpen={dropdownOpen}
            hasFilters={hasFilters}
            isLoading={isLoading}
            setDropdownOpen={setDropdownOpen}
            onApplyFilterClick={onApplyFilterClick && handleSubmit ? handleSubmit(onApplyFilterClick) : undefined}
            onResetClick={onApplyFilterClick ? () => onApplyFilterClick({ ...defaultFilter, query: searchParams?.get("query") || "" }) : undefined}
        >
            <AutocompleteController
                control={control}
                fieldName="state"
                label="State/Province"
                options={stateList}
                placeholder="State or Province Name"
            />
            <AutocompleteController
                control={control}
                fieldName="city"
                label="City"
                loading={isLoadingCities}
                options={cityList}
                placeholder="City Name"
            />
            <NumberInputController control={control} fieldName="minPrice" label="Minimum Price" placeholder="Minimum price" />
            <NumberInputController control={control} fieldName="maxPrice" label="Maximum Price" placeholder="Maximum price" />

            <SelectController control={control} fieldName="condition" label="Condition" options={VehicleConditionList} placeholder="All conditions" />
            <SelectController control={control} fieldName="fuelType" label="Fuel Type" options={FuelTypeList} placeholder="All fuel types" />
            <SelectController control={control} fieldName="vehicleType" label="Vehicle Type" options={VehicleTypeList} placeholder="All Types" />
            <SelectController
                control={control}
                fieldName="transmissionType"
                label="Transmission Type"
                options={TransmissionTypeList}
                placeholder="All Types"
            />

            <InputController control={control} fieldName="startCreatedDate" label="Created After" placeholder="Created after date" type="date" />
            <InputController control={control} fieldName="endCreatedDate" label="Created Before" placeholder="Created before date" type="date" />
            <InputController
                control={control}
                fieldName="yomStartDate"
                label="Manufactured after year"
                max={new Date().getFullYear()}
                min={YearSelectMinYear}
                placeholder="2000"
                type="number"
            />
            <InputController
                control={control}
                fieldName="yomEndDate"
                label="Manufactured before year"
                max={new Date().getFullYear()}
                min={YearSelectMinYear}
                placeholder="2015"
                type="number"
            />
        </FilterWrap>
    );
};
