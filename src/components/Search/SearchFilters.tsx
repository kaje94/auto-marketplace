"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { InputController } from "@/components/FormElements/Input";
import { YearInputController } from "@/components/FormElements/YearInput";
import { SearchIcon } from "@/icons";
import { useSearchContext } from "@/providers/search-provider";
import { FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList } from "@/utils/constants";
import { convertYearToDateString, getYearFromDateString } from "@/utils/helpers";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { PostedListingsFilterReq } from "@/utils/types";

const debouncedSearchRedirect = debounce((searchQuery: string, router: ReturnType<typeof useRouter>) => {
    router.push(`${window?.location?.pathname}?${searchQuery}`);
}, 1000);

const defaultFilter: PostedListingsFilterReq = {
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

export const SearchFilters = ({ pageLoading }: { pageLoading?: boolean }) => {
    const { setNewSearchQuery, hasSearchParams, searchParamsObj, searchParamStr, isLoading } = useSearchContext();

    const router = useRouter();

    const { reset, control, watch } = useForm<PostedListingsFilterReq>({
        resolver: zodResolver(PostedListingsFilterSchema),
        defaultValues: {
            ...defaultFilter,
            ...searchParamsObj,
            YomStartDate: searchParamsObj.YomStartDate ? `${getYearFromDateString(searchParamsObj.YomStartDate)}` : undefined,
            YomEndDate: searchParamsObj.YomEndDate ? `${getYearFromDateString(searchParamsObj.YomEndDate)}` : undefined,
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

    useEffect(() => {
        reset({
            ...defaultFilter,
            ...searchParamsObj,
            YomStartDate: searchParamsObj.YomStartDate ? `${getYearFromDateString(searchParamsObj.YomStartDate)}` : undefined,
            YomEndDate: searchParamsObj.YomEndDate ? `${getYearFromDateString(searchParamsObj.YomEndDate)}` : undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParamStr]);

    useEffect(() => {
        setNewSearchQuery(formQueryString);
        debouncedSearchRedirect(formQueryString, router);
    }, [formQueryString, router, setNewSearchQuery]);

    const onResetClick = useCallback(() => {
        setNewSearchQuery("");
        router.push("/search");
    }, [router, setNewSearchQuery]);

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
                <div className="col-span-2">
                    <div className="pb-0.5 pl-1 text-sm opacity-70">Price Range</div>
                    <div className="grid grid-cols-2 gap-2">
                        <InputController
                            control={control}
                            errorAsTooltip
                            fieldName="MinPrice"
                            inputPrefix="Rs."
                            loading={pageLoading}
                            placeholder="From"
                            type="number"
                        />
                        <InputController
                            control={control}
                            errorAsTooltip
                            fieldName="MaxPrice"
                            inputPrefix="Rs."
                            loading={pageLoading}
                            placeholder="To"
                            type="number"
                        />
                    </div>
                </div>
                <AutocompleteController
                    control={control}
                    errorAsTooltip
                    fieldName="Condition"
                    label="Condition"
                    loading={pageLoading}
                    options={VehicleConditionList}
                    placeholder="Condition"
                    showSelectedTick={false}
                />
                <InputController control={control} errorAsTooltip fieldName="City" label="City" loading={pageLoading} placeholder="City" />
                <InputController control={control} errorAsTooltip fieldName="Brand" label="Brand" loading={pageLoading} placeholder="Brand" />
                <InputController control={control} errorAsTooltip fieldName="Model" label="Model" loading={pageLoading} placeholder="Model" />
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
