import { useQuery } from "@tanstack/react-query";
import { ReadonlyURLSearchParams } from "next/navigation";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { getCitiesOfState } from "@/actions/localtionActions";
import { useScopedI18n } from "@/locales/client";
import { FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList } from "@/utils/constants";
import { LabelValue, PostedListingsFilterReq, State, VehicleBrand } from "@/utils/types";
import { FilterAutoComplete as AutocompleteController } from "./FilterFormElements/DashboardFilterAutoComplete";
import { FilterInput as InputController } from "./FilterFormElements/DashboardFilterInput";
import { FilterNumberInput as NumberInputController } from "./FilterFormElements/DashboardFilterNumberInput";
import { FilterSelect as SelectController } from "./FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "./FilterWrap";

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

    const tForm = useScopedI18n("form");

    const state = watch("State");
    const city = watch("City");

    const stateList = states?.map((item) => ({ label: item.name, value: item.name }) as LabelValue);

    const stateCode = states?.find((item) => item.name === state)?.stateCode;

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
            hasFilters={hasFilters}
            isLoading={isLoading}
            setDropdownOpen={setDropdownOpen}
            onApplyFilterClick={onApplyFilterClick && handleSubmit ? handleSubmit(onApplyFilterClick) : undefined}
            onResetClick={onApplyFilterClick ? () => onApplyFilterClick({ ...defaultFilter, Title: searchParams?.get("Title") || "" }) : undefined}
        >
            <AutocompleteController
                control={control}
                fieldName="State"
                label={tForm("state.label")}
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
                options={vehicleBrands?.map((item) => ({ label: item.name, value: item.name }))}
                placeholder={tForm("brand.placeholder")}
            />
            <InputController control={control} fieldName="Model" label={tForm("model.label")} placeholder={tForm("model.placeholder")} />
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
                fieldName="YomStartDate"
                label={tForm("yomStartDate.label")}
                placeholder={tForm("yomStartDate.placeholder")}
                type="date"
            />
            <InputController
                control={control}
                fieldName="YomEndDate"
                label={tForm("yomEndDate.label")}
                placeholder={tForm("yomEndDate.placeholder")}
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
            <SelectController
                control={control}
                fieldName="Condition"
                label={tForm("condition.label")}
                options={VehicleConditionList}
                placeholder={tForm("condition.optionalPlaceholder")}
            />
            <SelectController
                control={control}
                fieldName="Transmission"
                label={tForm("transmissionType.label")}
                options={TransmissionTypeList}
                placeholder={tForm("transmissionType.optionalPlaceholder")}
            />
        </FilterWrap>
    );
};
