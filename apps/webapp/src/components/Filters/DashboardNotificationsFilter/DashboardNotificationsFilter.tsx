import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { UserNotificationsFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "../FilterFormElements/DashboardFilterInput";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

interface Props {
    dropdownOpen?: boolean;
    form?: UseFormReturn<UserNotificationsFilterReq>;
    hasSearchParams?: boolean;
    isLoading?: boolean;
    onApplyFilterClick: (val: UserNotificationsFilterReq) => void;
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
    const { handleSubmit, control } = form as UseFormReturn<UserNotificationsFilterReq>;

    return (
        <FilterWrap
            dropdownOpen={dropdownOpen}
            hasFilters={hasSearchParams}
            isLoading={isLoading}
            setDropdownOpen={setDropdownOpen}
            onApplyFilterClick={handleSubmit(onApplyFilterClick)}
            onResetClick={onResetClick}
        >
            <InputController control={control} fieldName="startDate" label="From" placeholder="Notifications from date" type="date" />
            <InputController control={control} fieldName="endDate" label="To" placeholder="Notifications to date" type="date" />
        </FilterWrap>
    );
};
