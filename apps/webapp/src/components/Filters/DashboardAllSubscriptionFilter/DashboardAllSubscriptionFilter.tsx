import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { SubscriptFrequenciesList } from "@/utils/constants";
import { AdminSubscriptionsFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "../FilterFormElements/DashboardFilterInput";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    dropdownOpen?: boolean;
    form?: UseFormReturn<AdminSubscriptionsFilterReq>;
    hasSearchParams?: boolean;
    isLoading?: boolean;
    onApplyFilterClick: (val: AdminSubscriptionsFilterReq) => void;
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
    const { handleSubmit, control } = form as UseFormReturn<AdminSubscriptionsFilterReq>;

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
            <InputController control={control} fieldName="userEmail" label="User Email" placeholder="Email of the user" />
        </FilterWrap>
    );
};
