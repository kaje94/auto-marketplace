import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { SubscriptFrequenciesList } from "@/utils/constants";
import { UserSubscriptionsFilterReq } from "@/utils/types";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    dropdownOpen?: boolean;
    form?: UseFormReturn<UserSubscriptionsFilterReq>;
    hasSearchParams?: boolean;
    isLoading?: boolean;
    onApplyFilterClick: (val: UserSubscriptionsFilterReq) => void;
    onResetClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setDropdownOpen: (val: boolean) => void;
}

export const DashboardMySubscriptionFilter: FC<Props> = ({
    form,
    isLoading,
    dropdownOpen,
    hasSearchParams,
    onResetClick,
    setDropdownOpen,
    onApplyFilterClick,
}) => {
    const { handleSubmit, control } = form as UseFormReturn<UserSubscriptionsFilterReq>;

    return (
        <FilterWrap
            dropdownOpen={dropdownOpen}
            hasFilters={hasSearchParams}
            isLoading={isLoading}
            setDropdownOpen={setDropdownOpen}
            onApplyFilterClick={handleSubmit(onApplyFilterClick)}
            onResetClick={onResetClick}
        >
            <SelectController
                control={control}
                fieldName="activeStatus"
                label="Active/Inactive"
                options={[
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                ]}
                placeholder="All status types"
            />
            <SelectController
                control={control}
                fieldName="notificationFrequency"
                label="Notification Frequency"
                options={SubscriptFrequenciesList}
                placeholder="All frequency types"
            />
        </FilterWrap>
    );
};
