import { useRouter } from "next/navigation";
import qs from "query-string";
import { Dispatch, SetStateAction, useState } from "react";
import { UseFormReset } from "react-hook-form";
import { COUNTRIES } from "@/utils/countries";
import {
    DashboardListFilterReq,
    DashboardNotificationsFilterReq,
    DashboardSubscriptionFilterReq,
    MyListingsFilterReq,
    PostedListingsFilterReq,
} from "@/utils/types";

export const useDashboardFilter = ({
    reset,
    defaultFilter,
    searchParamsObj,
    newSearchQuery,
    setNewSearchQuery,
    isLoading,
}: {
    defaultFilter:
        | MyListingsFilterReq
        | DashboardListFilterReq
        | DashboardSubscriptionFilterReq
        | DashboardNotificationsFilterReq
        | PostedListingsFilterReq;
    isLoading: boolean;
    newSearchQuery: string;
    reset: UseFormReset<any>;
    searchParamsObj: Record<string, string>;
    setNewSearchQuery: Dispatch<SetStateAction<string>>;
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

    const onApplyFilterClick = (
        values:
            | MyListingsFilterReq
            | DashboardListFilterReq
            | DashboardSubscriptionFilterReq
            | DashboardNotificationsFilterReq
            | PostedListingsFilterReq,
    ) => {
        let queryValObj: any = { ...searchParamsObj, ...values };
        if ("Country" in values) {
            const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === values.Country);
            queryValObj = { ...queryValObj, Country: countryCode };
        }
        const searchQuery = qs.stringify(queryValObj, { skipEmptyString: true, skipNull: true });
        setDropdownOpen(false);
        if (newSearchQuery !== searchQuery) {
            reset(values);
            setNewSearchQuery(searchQuery);
            router.push(`${window?.location?.pathname}?${searchQuery}`);
        }
    };

    const handleFilterOpen = (event: React.MouseEvent<HTMLLabelElement | HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (!isLoading) {
            reset({ ...defaultFilter, ...searchParamsObj });
            setDropdownOpen(true);
        }
    };

    return { dropdownOpen, setDropdownOpen, onResetClick, onApplyFilterClick, handleFilterOpen };
};
