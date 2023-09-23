import { searchParamsToObject } from "@/utils/helpers";
import { MyListingsFilterReq, DashboardListFilterReq, DashboardSubscriptionFilterReq } from "@/utils/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { UseFormReset } from "react-hook-form";
import qs from "query-string";

export const useDashboardFilter = ({
    reset,
    defaultFilter,
    searchParamsObj,
    newSearchQuery,
    setNewSearchQuery,
    isLoading,
}: {
    reset: UseFormReset<{}>;
    defaultFilter: MyListingsFilterReq | DashboardListFilterReq | DashboardSubscriptionFilterReq;
    searchParamsObj: Record<string, string>;
    newSearchQuery: string;
    setNewSearchQuery: Dispatch<SetStateAction<string>>;
    isLoading: boolean;
}) => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const onResetClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setDropdownOpen(false);
        setNewSearchQuery("");
        reset(defaultFilter);
        router.push(window?.location?.pathname);
    };

    const onApplyFilterClick = (values: MyListingsFilterReq | DashboardListFilterReq | DashboardSubscriptionFilterReq) => {
        const searchQuery = qs.stringify({ ...searchParamsObj, ...values }, { skipEmptyString: true, skipNull: true });
        setDropdownOpen(false);
        if (newSearchQuery !== searchQuery) {
            reset(values);
            setNewSearchQuery(searchQuery);
            router.push(`${window?.location?.pathname}?${searchQuery}`);
        }
    };

    const handleFilterOpen = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        event.preventDefault();
        if (!isLoading) {
            reset({ ...defaultFilter, ...searchParamsObj });
            setDropdownOpen(true);
        }
    };

    return { dropdownOpen, setDropdownOpen, onResetClick, onApplyFilterClick, handleFilterOpen };
};

export const useFilter = ({
    reset,
    defaultFilter,
}: {
    reset: UseFormReset<{}>;
    defaultFilter: MyListingsFilterReq | DashboardListFilterReq | DashboardSubscriptionFilterReq;
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchParamsObj = searchParamsToObject(searchParams);
    const [newSearchQuery, setNewSearchQuery] = useState(qs.stringify({ ...searchParamsObj }));
    const loading = qs.stringify({ ...searchParamsObj }) !== newSearchQuery;

    useEffect(() => {
        setNewSearchQuery(qs.stringify({ ...searchParamsObj }));
    }, [searchParamsObj]);

    const onResetClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setDropdownOpen(false);
        setNewSearchQuery("");
        reset(defaultFilter);
        router.push(window?.location?.pathname);
    };

    const onApplyFilterClick = (values: MyListingsFilterReq | DashboardListFilterReq | DashboardSubscriptionFilterReq) => {
        const searchQuery = qs.stringify({ ...searchParamsObj, ...values }, { skipEmptyString: true, skipNull: true });
        setDropdownOpen(false);
        if (newSearchQuery !== searchQuery) {
            reset(values);
            setNewSearchQuery(searchQuery);
            router.push(`${window?.location?.pathname}?${searchQuery}`);
        }
    };

    const handleFilterOpen = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        event.preventDefault();
        if (!loading) {
            reset({ ...defaultFilter, ...searchParamsObj });
            setDropdownOpen(true);
        }
    };

    return { loading, dropdownOpen, setDropdownOpen, onResetClick, onApplyFilterClick, handleFilterOpen };
};
