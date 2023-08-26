import { searchParamsToObject } from "@/utils/helpers";
import { MyListingsFilterReq, DashboardListFilterReq } from "@/utils/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UseFormReset } from "react-hook-form";
import qs from "query-string";

export const useFilter = ({ reset, defaultFilter }: { reset: UseFormReset<{}>; defaultFilter: MyListingsFilterReq | DashboardListFilterReq }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchParamsObj = searchParamsToObject(searchParams);
    const [newSearchQuery, setNewSearchQuery] = useState(searchParams.toString());

    const onResetClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setLoading(true);
        setDropdownOpen(false);
        setNewSearchQuery("");
        reset(defaultFilter);
        router.push(window?.location?.pathname);
    };

    const onApplyFilterClick = (values: MyListingsFilterReq | DashboardListFilterReq) => {
        const searchQuery = qs.stringify({ ...searchParamsObj, ...values }, { skipEmptyString: true });
        setDropdownOpen(false);
        if (newSearchQuery !== searchQuery) {
            reset(values);
            setLoading(true);
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

    useEffect(() => {
        if (searchParams.toString() === newSearchQuery) {
            setLoading(false);
        }
    }, [searchParams, newSearchQuery, setLoading]);

    return { loading, dropdownOpen, setDropdownOpen, onResetClick, onApplyFilterClick, handleFilterOpen };
};
