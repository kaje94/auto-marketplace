"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import debounce from "lodash.debounce";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getCitiesOfState } from "@/actions/localtionActions";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { InputController } from "@/components/FormElements/Input";
import { NumberInputController } from "@/components/FormElements/NumberInput";
import { YearInputController } from "@/components/FormElements/YearInput";
import { SearchIcon } from "@/icons";
import { useSearchContext } from "@/providers/search-provider";
import { FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList } from "@/utils/constants";
import { COUNTRIES } from "@/utils/countries";
import { convertYearToDateString, getYearFromDateString } from "@/utils/helpers";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { LabelValue, PostedListingsFilterReq, State, VehicleBrand } from "@/utils/types";

const debouncedSearchRedirect = debounce((searchQuery: string, router: ReturnType<typeof useRouter>) => {
    router.push(`${window?.location?.pathname}?${searchQuery}`);
}, 1000);

const defaultFilter: PostedListingsFilterReq = {
    State: "",
    Brand: "",
    City: "",
    Condition: "",
    FuelType: "",
    MaxPrice: "",
    MinPrice: "",
    Model: "",
    Title: "",
    Transmission: "",
    VehicleType: "",
    YomEndDate: "",
    YomStartDate: "",
};

export const SearchFilters = ({
    pageLoading,
    vehicleBrands = [],
    states = [],
}: {
    pageLoading?: boolean;
    states?: State[];
    vehicleBrands?: VehicleBrand[];
}) => {
    const { setNewSearchQuery, hasSearchParams, searchParamsObj, searchParamStr, isLoading } = useSearchContext();

    const router = useRouter();
    const params = useParams();

    const { reset, control, watch, setValue } = useForm<PostedListingsFilterReq>({
        resolver: zodResolver(PostedListingsFilterSchema),
        defaultValues: {
            ...defaultFilter,
            ...searchParamsObj,
            YomStartDate: searchParamsObj.YomStartDate ? `${getYearFromDateString(searchParamsObj.YomStartDate as string)}` : undefined,
            YomEndDate: searchParamsObj.YomEndDate ? `${getYearFromDateString(searchParamsObj.YomEndDate as string)}` : undefined,
        },
        mode: "onChange",
    });

    const formValues = watch();

    const formQueryString = qs.stringify(
        {
            ...searchParamsObj,
            ...formValues,
            YomStartDate: formValues.YomStartDate ? convertYearToDateString(formValues.YomStartDate) : undefined,
            YomEndDate: formValues.YomEndDate ? convertYearToDateString(formValues.YomEndDate) : undefined,
        },
        { skipEmptyString: true, skipNull: true },
    );

    // todo: check if a use effect is needed
    useEffect(() => {
        reset({
            ...defaultFilter,
            ...searchParamsObj,
            YomStartDate: searchParamsObj.YomStartDate ? `${getYearFromDateString(searchParamsObj.YomStartDate as string)}` : undefined,
            YomEndDate: searchParamsObj.YomEndDate ? `${getYearFromDateString(searchParamsObj.YomEndDate as string)}` : undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParamStr]);

    useEffect(() => {
        setNewSearchQuery(formQueryString);
        debouncedSearchRedirect(formQueryString, router);
    }, [formQueryString, router, setNewSearchQuery]);

    const onResetClick = useCallback(() => {
        setNewSearchQuery("");
        router.push(`/${params.locale}/search`);
        reset(defaultFilter);
    }, [router, params, setNewSearchQuery]);

    useEffect(() => {
        if (!states?.some((item) => item.name === formValues.State)) {
            setValue("State", "");
            setValue("City", "");
        }
    }, [states]);

    const stateList = states?.map((item) => ({ label: item.name, value: item.name }) as LabelValue);

    const stateCode = states.find((item) => item.name === formValues.State)?.stateCode;

    const currencySymbol = COUNTRIES[typeof params.locale === "string" ? params.locale : ""]?.[2];

    const {
        data: cityList = [],
        isFetching: isLoadingCities,
        isError: cityFetchError,
    } = useQuery({
        queryFn: () => getCitiesOfState(params.locale as string, stateCode!),
        enabled: typeof params.locale === "string" && !!stateCode,
        queryKey: ["country-state-cities", { locale: params.locale as string, stateCode }],
        select: (data) => data.map((item) => ({ label: item.name, value: item.name }) as LabelValue),
        onSettled: (data, err) => {
            if (err || !data?.some((item) => item.label === formValues.City)) {
                setValue("City", "");
            }
        },
    });

    return (
        <aside className="relative top-0 lg:sticky lg:top-7 2xl:top-8">
            <div className="card grid grid-cols-2 gap-2 bg-base-100 p-3 shadow-md lg:p-5 xl:p-6">
                <div className="mt-0 lg:mt-2" />
                <InputController
                    control={control}
                    errorAsTooltip
                    fieldName="Title"
                    inputSuffix={<SearchIcon />}
                    loading={pageLoading}
                    placeholder="Search..."
                    rootClassName="col-span-2"
                />
                <div className="divider col-span-2 mt-4 lg:mt-6">Advanced Filters</div>
                <AutocompleteController
                    control={control}
                    errorAsTooltip
                    fieldName="VehicleType"
                    label="Vehicle Type"
                    loading={pageLoading}
                    options={VehicleTypeList}
                    placeholder="Type"
                    rootClassName="col-span-2"
                    showSelectedTick={false}
                />
                <AutocompleteController
                    control={control}
                    errorAsTooltip
                    fieldName="Condition"
                    label="Condition"
                    loading={pageLoading}
                    options={VehicleConditionList}
                    placeholder="Condition"
                    rootClassName="col-span-2"
                    showSelectedTick={false}
                />
                <AutocompleteController
                    control={control}
                    errorAsTooltip
                    fieldName="Brand"
                    label="Brand"
                    loading={pageLoading}
                    options={vehicleBrands.map((item) => ({ label: item.name, value: item.name }))}
                    placeholder="Toyota, Nissan, Honda, etc"
                    showSelectedTick={false}
                />
                <InputController control={control} errorAsTooltip fieldName="Model" label="Model" loading={pageLoading} placeholder="Model" />

                <NumberInputController
                    control={control}
                    errorAsTooltip
                    fieldName="MinPrice"
                    inputPrefix={currencySymbol}
                    label="Minimum Price"
                    loading={pageLoading}
                    min={0}
                    placeholder="1,000"
                    rootClassName="col-span-2"
                />
                <NumberInputController
                    control={control}
                    errorAsTooltip
                    fieldName="MaxPrice"
                    inputPrefix={currencySymbol}
                    label="Maximum Price"
                    loading={pageLoading}
                    min={0}
                    placeholder="100,000,000"
                    rootClassName="col-span-2"
                />
                {stateList?.length > 0 ? (
                    <AutocompleteController
                        control={control}
                        errorAsTooltip
                        fieldName="State"
                        label="State/Province"
                        loading={pageLoading}
                        options={stateList}
                        placeholder="Select State"
                        rootClassName="col-span-2"
                        showSelectedTick={false}
                    />
                ) : (
                    <InputController
                        control={control}
                        errorAsTooltip
                        fieldName="State"
                        label="State/Province"
                        loading={pageLoading}
                        placeholder="State or Province"
                        rootClassName="col-span-2"
                    />
                )}

                {cityList.length > 0 && !cityFetchError ? (
                    <AutocompleteController
                        control={control}
                        errorAsTooltip
                        fieldName="City"
                        label="City"
                        loading={pageLoading || isLoadingCities}
                        options={cityList}
                        placeholder="Select City"
                        rootClassName="col-span-2"
                        showSelectedTick={false}
                    />
                ) : (
                    <InputController
                        control={control}
                        errorAsTooltip
                        fieldName="City"
                        label="City"
                        loading={pageLoading || isLoadingCities}
                        placeholder="City"
                        rootClassName="col-span-2"
                    />
                )}

                <div className="col-span-2">
                    <div className="pb-0.5 pl-1 text-sm opacity-70">Manufactured Year Range</div>
                    <div className="grid grid-cols-2 gap-2">
                        <YearInputController control={control} errorAsTooltip fieldName="YomStartDate" loading={pageLoading} placeholder="From" />
                        <YearInputController control={control} errorAsTooltip fieldName="YomEndDate" loading={pageLoading} placeholder="To" />
                    </div>
                </div>
                <AutocompleteController
                    control={control}
                    errorAsTooltip
                    fieldName="FuelType"
                    label="Fuel Type"
                    loading={pageLoading}
                    options={FuelTypeList}
                    placeholder="Fuel Type"
                    showSelectedTick={false}
                />
                <AutocompleteController
                    control={control}
                    errorAsTooltip
                    fieldName="Transmission"
                    label="Transmission"
                    loading={pageLoading}
                    options={TransmissionTypeList}
                    placeholder="Transmission"
                    showSelectedTick={false}
                />
                <button
                    className={clsx("btn btn-accent btn-outline col-span-2 mt-3 lg:mt-5", !hasSearchParams && "opacity-50")}
                    disabled={!hasSearchParams || pageLoading || isLoading}
                    onClick={onResetClick}
                >
                    Reset
                </button>
            </div>
        </aside>
    );
};
