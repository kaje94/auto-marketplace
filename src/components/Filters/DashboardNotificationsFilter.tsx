import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useScopedI18n } from "@/locales/client";
import { DashboardNotificationsFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "./FilterFormElements/DashboardFilterInput";
import { FilterSelect as SelectController } from "./FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "./FilterWrap";

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

    const tForm = useScopedI18n("form");

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
                    label={tForm("notificationIsShown.label")}
                    options={[
                        { label: tForm("notificationIsShown.seen"), value: "true" },
                        { label: tForm("notificationIsShown.new"), value: "false" },
                    ]}
                    placeholder={tForm("notificationIsShown.optionalPlaceholder")}
                />
            </div>
            <InputController
                control={control}
                fieldName="StartDate"
                label={tForm("startNotifications.label")}
                placeholder={tForm("startNotifications.placeholder")}
                type="date"
            />
            <InputController
                control={control}
                fieldName="EndDate"
                label={tForm("endNotifications.label")}
                placeholder={tForm("endNotifications.placeholder")}
                type="date"
            />
        </FilterWrap>
    );
};
