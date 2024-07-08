import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { GetStatesResponse_StateItem } from "targabay-protos/gen/ts/dist/types/locations_pb";
import { getCitiesOfState } from "@/actions/locationActions";
import { VEHICLE_BRANDS } from "@/utils/brands";
import { FuelTypeList, ListingTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList, YearSelectMinYear } from "@/utils/constants";
import { LabelValue, UserListingsFilterReq } from "@/utils/types";
import { FilterAutoComplete as AutocompleteController } from "../FilterFormElements/DashboardFilterAutoComplete";
import { FilterInput as InputController } from "../FilterFormElements/DashboardFilterInput";
import { FilterNumberInput as NumberInputController } from "../FilterFormElements/DashboardFilterNumberInput";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    countryCode?: string;
    dropdownOpen?: boolean;
    form?: UseFormReturn<UserListingsFilterReq>;
    hasSearchParams?: boolean;
    isLoading?: boolean;
    onApplyFilterClick: (val: UserListingsFilterReq) => void;
    onResetClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setDropdownOpen: (val: boolean) => void;
    states?: GetStatesResponse_StateItem[];
}

export const DashboardMyListFilter: FC<Props> = ({
    form,
    isLoading,
    dropdownOpen,
    hasSearchParams,
    onResetClick,
    setDropdownOpen,
    onApplyFilterClick,
    countryCode,
    states = [],
}) => {
    const {
        handleSubmit,
        control,
        watch = (_: string) => "",
        setValue = (_key: string, _value: string) => null,
    } = form as UseFormReturn<UserListingsFilterReq>;

    const state = watch("state");
    const city = watch("city");

    const stateList = states?.map((item) => ({ label: item.stateName, value: item.stateName }) as LabelValue);

    const stateCode = states.find((item) => item.stateName === state)?.id;

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
            hasFilters={hasSearchParams}
            isLoading={isLoading}
            setDropdownOpen={setDropdownOpen}
            onApplyFilterClick={handleSubmit(onApplyFilterClick)}
            onResetClick={onResetClick}
        >
            <div className="col-span-full">
                <SelectController control={control} fieldName="status" label="Status" options={ListingTypeList} placeholder="All status types" />
            </div>
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
            <AutocompleteController
                control={control}
                fieldName="brand"
                label="Brand"
                options={VEHICLE_BRANDS.map((item) => ({ label: item, value: item }))}
                placeholder="Toyota, Nissan, Honda, etc"
            />
            <InputController control={control} fieldName="model" label="Model" placeholder="Civic, Sunny, Swift, etc" />
            <SelectController control={control} fieldName="condition" label="Condition" options={VehicleConditionList} placeholder="All conditions" />
            <SelectController control={control} fieldName="FuelType" label="Fuel Type" options={FuelTypeList} placeholder="All fuel types" />
            <SelectController control={control} fieldName="vehicleType" label="Vehicle Type" options={VehicleTypeList} placeholder="All Types" />
            <SelectController
                control={control}
                fieldName="transmissionType"
                label="Transmission Type"
                options={TransmissionTypeList}
                placeholder="All Types"
            />
            <NumberInputController control={control} fieldName="minPrice" label="Minimum Price" placeholder="Minimum price" />
            <NumberInputController control={control} fieldName="maxPrice" label="Maximum Price" placeholder="Maximum price" />
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
