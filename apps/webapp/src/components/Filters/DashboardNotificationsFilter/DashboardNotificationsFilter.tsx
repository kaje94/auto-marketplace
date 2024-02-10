import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { DashboardNotificationsFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "../FilterFormElements/DashboardFilterInput";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    dropdownOpen?: boolean;
    form?: UseFormReturn<DashboardNotificationsFilterReq>;
    hasSearchParams?: boolean;
    isLoading?: boolean;
    onApplyFilterClick: (val: DashboardNotificationsFilterReq) => void;
    onResetClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setDropdownOpen: (val: boolean) => void;
}

export const DashboardNotificationsFilter: FC<Props> = ({
    form,
    isLoading,
    dropdownOpen,
    hasSearchParams,
    onResetClick,
    setDropdownOpen,
    onApplyFilterClick,
}) => {
    const { handleSubmit, control } = form as UseFormReturn<DashboardNotificationsFilterReq>;

    return (
        <FilterWrap
            dropdownOpen={dropdownOpen}
            hasFilters={hasSearchParams}
            isLoading={isLoading}
            setDropdownOpen={setDropdownOpen}
            onApplyFilterClick={handleSubmit(onApplyFilterClick)}
            onResetClick={onResetClick}
        >
            <div className="col-span-full">
                <SelectController
                    control={control}
                    fieldName="IsShown"
                    label="Type"
                    options={[
                        { label: "Seen notifications", value: "true" },
                        { label: "New notifications", value: "false" },
                    ]}
                    placeholder="All notifications"
                />
            </div>
            <InputController control={control} fieldName="StartDate" label="From" placeholder="Notifications from date" type="date" />
            <InputController control={control} fieldName="EndDate" label="To" placeholder="Notifications to date" type="date" />
        </FilterWrap>
    );
};
