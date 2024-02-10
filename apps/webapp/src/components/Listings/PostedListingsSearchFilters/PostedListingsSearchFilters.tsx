"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LinkWithLocale } from "@/components/Common";
import { FilterInput as InputController } from "@/components/Filters/FilterFormElements/DashboardFilterInput";
import { PostedListSearchFilters } from "@/components/Filters/PostedListSearchFilters";
import { FilterIcon, SearchIcon } from "@/icons";
import { usePostedListingsContext } from "@/providers/PostedListingsContextProvider";
import { getYearFromDateString } from "@/utils/helpers";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { PostedListingsFilterReq, State, VehicleBrand } from "@/utils/types";

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

export const PostedListingsSearchFilters = ({
    pageLoading,
    vehicleBrands = [],
    states = [],
}: {
    pageLoading?: boolean;
    states?: State[];
    vehicleBrands?: VehicleBrand[];
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [applyingSearch, setApplyingSearch] = useState(false);
    const [applyingFilters, setApplyingFilters] = useState(false);
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const countryCode = params.locale as string;
    const titleSearchParam = searchParams.get("Title") || "";

    const { setNewSearchQuery, searchParamsObj, isLoading, newSearchQuery } = usePostedListingsContext();

    const form = useForm<PostedListingsFilterReq>({
        resolver: zodResolver(PostedListingsFilterSchema),
        defaultValues: {
            ...defaultFilter,
            ...searchParamsObj,
            YomStartDate: searchParamsObj.YomStartDate ? `${getYearFromDateString(searchParamsObj.YomStartDate as string)}` : undefined,
            YomEndDate: searchParamsObj.YomEndDate ? `${getYearFromDateString(searchParamsObj.YomEndDate as string)}` : undefined,
        },
        mode: "onChange",
    });
    const { control, watch, reset, setValue } = form;

    const newSearchFiltersParamsObj = { ...searchParamsObj };
    delete newSearchFiltersParamsObj["Title"];
    const hasFilters = Object.keys(PostedListingsFilterSchema.parse(newSearchFiltersParamsObj)).length > 0;

    const hasNewSearchText = titleSearchParam !== watch("Title");

    const onApplyFilterClick = (values: PostedListingsFilterReq) => {
        const searchQuery = qs.stringify({ ...searchParamsObj, ...values }, { skipEmptyString: true, skipNull: true });
        setDropdownOpen(false);
        if (newSearchQuery !== searchQuery) {
            reset(values);
            setApplyingFilters(true);
            setNewSearchQuery(searchQuery);
            router.push(`${window?.location?.pathname}${searchQuery ? `?${searchQuery}` : ""}`);
        }
    };

    const handleFilterOpen = (event: React.MouseEvent<HTMLLabelElement | HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (!isLoading) {
            reset({ ...defaultFilter, ...searchParamsObj, Title: watch("Title") });
            setDropdownOpen(true);
        }
    };

    const formValues = watch();

    const newSearchBtnQuery = qs.stringify(formValues, { skipEmptyString: true, skipNull: true });

    useEffect(() => {
        setValue("Title", titleSearchParam);
    }, [setValue, titleSearchParam]);

    useEffect(() => {
        if (!isLoading) {
            setApplyingSearch(false);
            setApplyingFilters(false);
        }
    }, [isLoading]);

    return (
        <div className={clsx("flex flex-col items-center gap-2 pt-4 lg:pt-8", pageLoading && "animate-pulse")}>
            <div
                className={clsx(
                    "rounded-box relative flex w-full flex-col items-end justify-end sm:w-auto sm:flex-row sm:px-0",
                    pageLoading && "opacity-50",
                )}
            >
                <InputController
                    control={control}
                    fieldName="Title"
                    inputClassNames="bg-white !border-neutral sm:border-r-0 rounded-box rounded-b-none sm:rounded-b-box sm:rounded-r-none"
                    loading={isLoading || pageLoading}
                    placeholder="Search..."
                    rootClassName="xl:w-80"
                    errorAsTooltip
                    onKeyUp={(event) => {
                        if (event.key === "Enter" && hasNewSearchText) {
                            setNewSearchQuery(newSearchBtnQuery);
                            setApplyingSearch(true);
                            router.push(`/${countryCode}/search${newSearchBtnQuery ? `?${newSearchBtnQuery}` : ""}`);
                        }
                    }}
                />
                <LinkWithLocale
                    className={clsx(
                        "btn join-item w-full rounded-none   !border-neutral sm:w-auto sm:border-r-0",
                        hasNewSearchText ? "!btn-secondary" : "!btn-outline",
                        (isLoading || pageLoading) && "btn-disabled",
                    )}
                    href={`/search${newSearchBtnQuery ? `?${newSearchBtnQuery}` : ""}`}
                    onClick={() => {
                        if (hasNewSearchText) {
                            setNewSearchQuery(newSearchBtnQuery);
                            setApplyingSearch(true);
                        }
                    }}
                >
                    {applyingSearch ? <span className="loading loading-spinner ml-1 opacity-40" /> : <SearchIcon className="ml-1" />}
                    <span className="w-20">Search</span>
                </LinkWithLocale>
                <button
                    className={clsx(
                        "btn join-item rounded-box w-full rounded-t-none px-5 transition-all duration-200 sm:rounded-t-box sm:w-auto sm:rounded-l-none",
                        dropdownOpen && "rounded-br-none",
                        hasFilters ? "!btn-neutral" : "!btn-outline",
                    )}
                    disabled={isLoading || pageLoading}
                    onClick={handleFilterOpen}
                >
                    {applyingFilters ? <span className="loading loading-spinner -ml-1 opacity-40" /> : <FilterIcon className="-ml-1" />}
                    <span className="ml-2 flex flex-col items-start justify-start">
                        <span>Filters</span>
                        {hasFilters && <span className="text-xs font-light capitalize">Applied</span>}
                    </span>
                </button>
                {!pageLoading && (
                    <PostedListSearchFilters
                        countryCode={countryCode}
                        defaultFilter={defaultFilter}
                        dropdownOpen={dropdownOpen}
                        form={form}
                        hasFilters={hasFilters}
                        searchParams={searchParams}
                        setDropdownOpen={setDropdownOpen}
                        states={states}
                        vehicleBrands={vehicleBrands}
                        onApplyFilterClick={onApplyFilterClick}
                    />
                )}
            </div>
        </div>
    );
};
