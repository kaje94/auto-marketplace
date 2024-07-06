"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GetStatesResponse_StateItem } from "targabay-protos/gen/ts/dist/types/locations_pb";
import { LinkWithLocale } from "@/components/Common";
import { FilterInput as InputController } from "@/components/Filters/FilterFormElements/DashboardFilterInput";
import { PostedListSearchFilters } from "@/components/Filters/PostedListSearchFilters";
import { FilterIcon, SearchIcon } from "@/icons";
import { usePostedListingsContext } from "@/providers/PostedListingsContextProvider";
import { PublicListingsFilterSchema } from "@/utils/schemas";
import { PublicListingsFilterReq } from "@/utils/types";

const defaultFilter: PublicListingsFilterReq = {
    state: "",
    city: "",
    condition: "",
    fuelType: "",
    maxPrice: undefined,
    minPrice: undefined,
    startCreatedDate: "",
    endCreatedDate: "",
    transmissionType: "",
    vehicleType: "",
    yomEndDate: "",
    yomStartDate: "",
    query: "",
};

export const PostedListingsSearchFilters = ({ pageLoading, states = [] }: { pageLoading?: boolean; states?: GetStatesResponse_StateItem[] }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [applyingSearch, setApplyingSearch] = useState(false);
    const [applyingFilters, setApplyingFilters] = useState(false);
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const countryCode = params.locale as string;
    const titleSearchParam = searchParams.get("query") || "";

    const { setNewSearchQuery, searchParamsObj, isLoading, newSearchQuery } = usePostedListingsContext();

    const form = useForm<PublicListingsFilterReq>({
        resolver: zodResolver(PublicListingsFilterSchema),
        defaultValues: { ...defaultFilter, ...searchParamsObj },
        mode: "onChange",
    });
    const { control, watch, reset, setValue } = form;

    const newSearchFiltersParamsObj = { ...searchParamsObj };
    delete newSearchFiltersParamsObj["query"];
    const hasFilters = Object.keys(PublicListingsFilterSchema.parse(newSearchFiltersParamsObj)).length > 0;

    const hasNewSearchText = titleSearchParam !== watch("query");

    const onApplyFilterClick = (values: PublicListingsFilterReq) => {
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
            reset({ ...defaultFilter, ...searchParamsObj, query: watch("query") });
            setDropdownOpen(true);
        }
    };

    const formValues = watch();

    const newSearchBtnQuery = qs.stringify(formValues, { skipEmptyString: true, skipNull: true });

    useEffect(() => {
        setValue("query", titleSearchParam);
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
                    fieldName="query"
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
                        onApplyFilterClick={onApplyFilterClick}
                    />
                )}
            </div>
        </div>
    );
};
