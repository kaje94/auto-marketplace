import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useScopedI18n } from "@/locales/client";
import { SubscriptFrequenciesList } from "@/utils/constants";
import { DashboardSubscriptionFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "./FilterFormElements/DashboardFilterInput";
import { FilterSelect as SelectController } from "./FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "./FilterWrap";

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

    const tForm = useScopedI18n("form");
    const tCommon = useScopedI18n("common");

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
                label={tForm("subscriptionActive.label")}
                options={[
                    { label: tCommon("active"), value: "true" },
                    { label: tCommon("inactive"), value: "false" },
                ]}
                placeholder={tForm("subscriptionActive.optionalPlaceholder")}
            />
            <SelectController
                control={control}
                fieldName="NotificationFrequency"
                label={tForm("subscriptionFrequency.label")}
                options={SubscriptFrequenciesList}
                placeholder={tForm("subscriptionFrequency.optionalPlaceholder")}
            />
            <InputController control={control} fieldName="UserId" label={tForm("userId.label")} placeholder={tForm("userId.placeholder")} />
        </FilterWrap>
    );
};
