import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { getCitiesOfState, getStatesOfCountry } from "@/actions/localtionActions";
import { useScopedI18n } from "@/locales/client";
import { FuelTypeList, ListingTypeList, VehicleTypeList } from "@/utils/constants";
import { COUNTRIES } from "@/utils/countries";
import { DashboardListFilterReq, LabelValue, VehicleBrand } from "@/utils/types";
import { FilterAutoComplete as AutocompleteController } from "./FilterFormElements/DashboardFilterAutoComplete";
import { FilterInput as InputController } from "./FilterFormElements/DashboardFilterInput";
import { FilterNumberInput as NumberInputController } from "./FilterFormElements/DashboardFilterNumberInput";
import { FilterSelect as SelectController } from "./FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "./FilterWrap";

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

    const tForm = useScopedI18n("form");

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
                <InputController control={control} fieldName="Title" label={tForm("title.label")} placeholder={tForm("title.placeholder")} />
            </div>
            <AutocompleteController
                control={control}
                fieldName="Country"
                label={tForm("country.label")}
                options={countryList}
                placeholder={tForm("country.placeholder")}
            />
            <AutocompleteController
                control={control}
                fieldName="State"
                label={tForm("state.label")}
                loading={isLoadingStates}
                options={stateList}
                placeholder={tForm("state.placeholder")}
            />
            <AutocompleteController
                control={control}
                fieldName="City"
                label={tForm("city.label")}
                loading={isLoadingCities}
                options={cityList}
                placeholder={tForm("city.placeholder")}
            />
            <AutocompleteController
                control={control}
                fieldName="Brand"
                label={tForm("brand.label")}
                options={vehicleBrands.map((item) => ({ label: item.name, value: item.name }))}
                placeholder={tForm("brand.placeholder")}
            />
            <InputController control={control} fieldName="Model" label={tForm("model.label")} placeholder={tForm("model.placeholder")} />
            <SelectController
                control={control}
                fieldName="ListingStatus"
                label={tForm("listingStatus.label")}
                options={ListingTypeList}
                placeholder={tForm("listingStatus.optionalPlaceholder")}
            />
            <NumberInputController
                control={control}
                fieldName="MinPrice"
                label={tForm("minPrice.label")}
                placeholder={tForm("minPrice.placeholder")}
            />
            <NumberInputController
                control={control}
                fieldName="MaxPrice"
                label={tForm("maxPrice.label")}
                placeholder={tForm("maxPrice.placeholder")}
            />
            <InputController
                control={control}
                fieldName="StartCreatedDate"
                label={tForm("startCreatedDate.label")}
                placeholder={tForm("startCreatedDate.placeholder")}
                type="date"
            />
            <InputController
                control={control}
                fieldName="EndCreatedDate"
                label={tForm("endCreatedDate.label")}
                placeholder={tForm("endCreatedDate.placeholder")}
                type="date"
            />
            <SelectController
                control={control}
                fieldName="VehicleType"
                label={tForm("vehicleType.label")}
                options={VehicleTypeList}
                placeholder={tForm("vehicleType.optionalPlaceholder")}
            />
            <SelectController
                control={control}
                fieldName="FuelType"
                label={tForm("fuelType.label")}
                options={FuelTypeList}
                placeholder={tForm("fuelType.optionalPlaceholder")}
            />
        </FilterWrap>
    );
};
