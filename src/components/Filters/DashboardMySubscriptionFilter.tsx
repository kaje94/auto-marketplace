import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useScopedI18n } from "@/locales/client";
import { SubscriptFrequenciesList } from "@/utils/constants";
import { DashboardMySubscriptionFilterReq } from "@/utils/types";
import { FilterSelect as SelectController } from "./FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "./FilterWrap";

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
        </FilterWrap>
    );
};
