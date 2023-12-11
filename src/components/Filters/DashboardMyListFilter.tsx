"use client";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useScopedI18n } from "@/locales/client";
import { ListingTypeList } from "@/utils/constants";
import { MyListingsFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "./FilterFormElements/DashboardFilterInput";
import { FilterSelect as SelectController } from "./FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "./FilterWrap";

interface Props {
    dropdownOpen?: boolean;
    form?: UseFormReturn<MyListingsFilterReq>;
    hasSearchParams?: boolean;
    isLoading?: boolean;
    onApplyFilterClick: (val: MyListingsFilterReq) => void;
    onResetClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setDropdownOpen: (val: boolean) => void;
}

export const DashboardMyListFilter: FC<Props> = ({
    form,
    isLoading,
    dropdownOpen,
    hasSearchParams,
    onResetClick,
    setDropdownOpen,
    onApplyFilterClick,
}) => {
    const { handleSubmit, control } = form as UseFormReturn<MyListingsFilterReq>;

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
                    fieldName="ListingStatus"
                    label={tForm("listingStatus.label")}
                    options={ListingTypeList}
                    placeholder={tForm("listingStatus.optionalPlaceholder")}
                />
            </div>

            <InputController
                control={control}
                fieldName="StartCreatedDate"
                label={tForm("startCreatedDate.label")}
                placeholder={tForm("startCreatedDate.placeholder")}
                type="date"
            />
            <InputController
                control={control}
                fieldName="EndCreatedDate"
                label={tForm("endCreatedDate.label")}
                placeholder={tForm("endCreatedDate.placeholder")}
                type="date"
            />
        </FilterWrap>
    );
};
