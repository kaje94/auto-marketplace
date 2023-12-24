import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { SubscriptFrequenciesList } from "@/utils/constants";
import { DashboardSubscriptionFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "../FilterFormElements/DashboardFilterInput";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    dropdownOpen?: boolean;
    form?: UseFormReturn<DashboardSubscriptionFilterReq>;
    hasSearchParams?: boolean;
    isLoading?: boolean;
    onApplyFilterClick: (val: DashboardSubscriptionFilterReq) => void;
    onResetClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setDropdownOpen: (val: boolean) => void;
}

export const DashboardAllSubscriptionFilter: FC<Props> = ({
    form,
    isLoading,
    dropdownOpen,
    hasSearchParams,
    onResetClick,
    setDropdownOpen,
    onApplyFilterClick,
}) => {
    const { handleSubmit, control } = form as UseFormReturn<DashboardSubscriptionFilterReq>;

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
            <InputController control={control} fieldName="UserId" label="User ID" placeholder="ID of the user" />
        </FilterWrap>
    );
};
