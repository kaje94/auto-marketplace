import { useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams } from "next/navigation";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { getCitiesOfState } from "@/actions/locationActions";
import { BOT_LOCALE, FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList } from "@/utils/constants";
import { LabelValue, PostedListingsFilterReq, State, VehicleBrand } from "@/utils/types";
import { FilterAutoComplete as AutocompleteController } from "../FilterFormElements/DashboardFilterAutoComplete";
import { FilterInput as InputController } from "../FilterFormElements/DashboardFilterInput";
import { FilterNumberInput as NumberInputController } from "../FilterFormElements/DashboardFilterNumberInput";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    countryCode?: string;
    defaultFilter: PostedListingsFilterReq;
    dropdownOpen: boolean;
    form?: UseFormReturn<PostedListingsFilterReq>;
    hasFilters?: boolean;
    isLoading?: boolean;
    onApplyFilterClick?: (values: PostedListingsFilterReq) => void;
    searchParams?: ReadonlyURLSearchParams;
    setDropdownOpen: (open: boolean) => void;
    states?: State[];
    vehicleBrands?: VehicleBrand[];
}

export const PostedListSearchFilters: FC<Props> = ({
    dropdownOpen,
    setDropdownOpen,
    hasFilters,
    vehicleBrands,
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
    } = form as UseFormReturn<PostedListingsFilterReq>;

    const state = watch("State");
    const city = watch("City");

    const stateList = states?.map((item) => ({ label: item.name, value: item.name }) as LabelValue);

    const stateCode = states?.find((item) => item.name === state)?.stateCode;

    const { data: cityList = [], isFetching: isLoadingCities } = useQuery({
        queryFn: () => getCitiesOfState(countryCode!, stateCode!),
        enabled: !!countryCode && !!stateCode && countryCode !== BOT_LOCALE,
        queryKey: ["country-state-cities", { locale: countryCode, stateCode }],
        select: (data) => data.map((item) => ({ label: item.name, value: item.name }) as LabelValue),
        onSettled: (data, _) => {
            if (!!data?.length && !data?.some((item) => item.label === city)) {
                setValue("City", "");
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
            onResetClick={onApplyFilterClick ? () => onApplyFilterClick({ ...defaultFilter, Title: searchParams?.get("Title") || "" }) : undefined}
        >
            <AutocompleteController control={control} fieldName="State" label="State/Province" options={stateList} placeholder="State Name" />
            <AutocompleteController
                control={control}
                fieldName="City"
                label="City"
                loading={isLoadingCities}
                options={cityList}
                placeholder="City Name"
            />
            <AutocompleteController
                control={control}
                fieldName="Brand"
                label="Brand"
                options={vehicleBrands?.map((item) => ({ label: item.name, value: item.name }))}
                placeholder="Toyota, Nissan, Honda, etc"
            />
            <InputController control={control} fieldName="Model" label="Model" placeholder="Civic, Sunny, Swift, etc" />
            <NumberInputController control={control} fieldName="MinPrice" label="Minimum Price" placeholder="Minimum price" />
            <NumberInputController control={control} fieldName="MaxPrice" label="Maximum Price" placeholder="Maximum price" />
            <InputController
                control={control}
                fieldName="YomStartDate"
                label="Manufactured After"
                placeholder="Manufactured after date"
                type="date"
            />
            <InputController
                control={control}
                fieldName="YomEndDate"
                label="Manufactured Before"
                placeholder="Manufactured before date"
                type="date"
            />
            <SelectController control={control} fieldName="VehicleType" label="Vehicle Type" options={VehicleTypeList} placeholder="All Types" />
            <SelectController control={control} fieldName="FuelType" label="Fuel Type" options={FuelTypeList} placeholder="All fuel types" />
            <SelectController control={control} fieldName="Condition" label="Vehicle Condition" options={VehicleConditionList} placeholder="All" />
            <SelectController
                control={control}
                fieldName="Transmission"
                label="Transmission Type"
                options={TransmissionTypeList}
                placeholder="All Types"
            />
        </FilterWrap>
    );
};
