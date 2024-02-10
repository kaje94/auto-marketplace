import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { SubscriptFrequenciesList } from "@/utils/constants";
import { DashboardMySubscriptionFilterReq } from "@/utils/types";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    dropdownOpen?: boolean;
    form?: UseFormReturn<DashboardMySubscriptionFilterReq>;
    hasSearchParams?: boolean;
    isLoading?: boolean;
    onApplyFilterClick: (val: DashboardMySubscriptionFilterReq) => void;
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
    const { handleSubmit, control } = form as UseFormReturn<DashboardMySubscriptionFilterReq>;

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
                fieldName="Active"
                label="Active/Inactive"
                options={[
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                ]}
                placeholder="All status types"
            />
            <SelectController
                control={control}
                fieldName="NotificationFrequency"
                label="Notification Frequency"
                options={SubscriptFrequenciesList}
                placeholder="All frequency types"
            />
        </FilterWrap>
    );
};
