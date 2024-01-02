import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { getCitiesOfState, getStatesOfCountry } from "@/actions/locationActions";
import { BOT_LOCALE, FuelTypeList, ListingTypeList, VehicleTypeList } from "@/utils/constants";
import { COUNTRIES } from "@/utils/countries";
import { DashboardListFilterReq, LabelValue, VehicleBrand } from "@/utils/types";
import { FilterAutoComplete as AutocompleteController } from "../FilterFormElements/DashboardFilterAutoComplete";
import { FilterInput as InputController } from "../FilterFormElements/DashboardFilterInput";
import { FilterNumberInput as NumberInputController } from "../FilterFormElements/DashboardFilterNumberInput";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    dropdownOpen?: boolean;
    form?: UseFormReturn<DashboardListFilterReq>;
    hasSearchParams?: boolean;
    isLoading?: boolean;
    onApplyFilterClick: (val: DashboardListFilterReq) => void;
    onResetClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setDropdownOpen: (val: boolean) => void;
    vehicleBrands?: VehicleBrand[];
}

export const DashboardAllListFilter: FC<Props> = ({
    vehicleBrands = [],
    form,
    isLoading,
    dropdownOpen,
    hasSearchParams,
    onResetClick,
    setDropdownOpen,
    onApplyFilterClick,
}) => {
    const {
        handleSubmit,
        control,
        watch = (_: string) => "",
        setValue = (_key: string, _value: string) => null,
    } = form as UseFormReturn<DashboardListFilterReq>;

    const country = watch("Country");
    const state = watch("State");
    const city = watch("City");

    const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === country);

    const countryList: LabelValue[] = Object.keys(COUNTRIES).map((key) => ({
        label: COUNTRIES[key]?.[0]!,
        value: COUNTRIES[key]?.[0]!,
    }));

    const { data: states = [], isFetching: isLoadingStates } = useQuery({
        queryFn: () => getStatesOfCountry(countryCode!),
        enabled: !!countryCode && countryCode !== BOT_LOCALE,
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

    const { data: cityList = [], isFetching: isLoadingCities } = useQuery({
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
        <FilterWrap
            dropdownOpen={dropdownOpen}
            hasFilters={hasSearchParams}
            isLoading={isLoading}
            setDropdownOpen={setDropdownOpen}
            onApplyFilterClick={handleSubmit(onApplyFilterClick)}
            onResetClick={onResetClick}
        >
            <div className="col-span-full">
                <InputController control={control} fieldName="Title" label="Title" placeholder="Advert Title" />
            </div>
            <AutocompleteController control={control} fieldName="Country" label="Country" options={countryList} placeholder="Select Country" />
            <AutocompleteController
                control={control}
                fieldName="State"
                label="State/Province"
                loading={isLoadingStates}
                options={stateList}
                placeholder="State or Province Name"
            />
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
                options={vehicleBrands.map((item) => ({ label: item.name, value: item.name }))}
                placeholder="Toyota, Nissan, Honda, etc"
            />
            <InputController control={control} fieldName="Model" label="Model" placeholder="Civic, Sunny, Swift, etc" />
            <SelectController control={control} fieldName="ListingStatus" label="Status" options={ListingTypeList} placeholder="All status types" />
            <NumberInputController control={control} fieldName="MinPrice" label="Minimum Price" placeholder="Minimum price" />
            <NumberInputController control={control} fieldName="MaxPrice" label="Maximum Price" placeholder="Maximum price" />
            <InputController control={control} fieldName="StartCreatedDate" label="Created After" placeholder="Created after date" type="date" />
            <InputController control={control} fieldName="EndCreatedDate" label="Created Before" placeholder="Created before date" type="date" />
            <SelectController control={control} fieldName="VehicleType" label="Vehicle Type" options={VehicleTypeList} placeholder="All Types" />
            <SelectController control={control} fieldName="FuelType" label="Fuel Type" options={FuelTypeList} placeholder="All fuel types" />
        </FilterWrap>
    );
};
