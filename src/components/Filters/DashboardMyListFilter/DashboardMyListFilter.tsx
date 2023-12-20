import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { ListingTypeList } from "@/utils/constants";
import { MyListingsFilterReq } from "@/utils/types";
import { FilterInput as InputController } from "../FilterFormElements/DashboardFilterInput";
import { FilterSelect as SelectController } from "../FilterFormElements/DashboardFilterSelect";
import { FilterWrap } from "../FilterFormElements/FilterWrap";

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
                    label="Status"
                    options={ListingTypeList}
                    placeholder="All status types"
                />
            </div>

            <InputController control={control} fieldName="StartCreatedDate" label="Created After" placeholder="Created after date" type="date" />
            <InputController control={control} fieldName="EndCreatedDate" label="Created Before" placeholder="Created before date" type="date" />
        </FilterWrap>
    );
};
