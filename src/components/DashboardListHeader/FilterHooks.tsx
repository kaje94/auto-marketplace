import { useRouter } from "next/navigation";
import qs from "query-string";
import { Dispatch, SetStateAction, useState } from "react";
import { UseFormReset } from "react-hook-form";
import { DashboardListFilterReq, DashboardNotificationsFilterReq, DashboardSubscriptionFilterReq, MyListingsFilterReq } from "@/utils/types";

export const useDashboardFilter = ({
    reset,
    defaultFilter,
    searchParamsObj,
    newSearchQuery,
    setNewSearchQuery,
    isLoading,
}: {
    reset: UseFormReset<{}>;
    defaultFilter: MyListingsFilterReq | DashboardListFilterReq | DashboardSubscriptionFilterReq | DashboardNotificationsFilterReq;
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

    const onApplyFilterClick = (
        values: MyListingsFilterReq | DashboardListFilterReq | DashboardSubscriptionFilterReq | DashboardNotificationsFilterReq
    ) => {
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
