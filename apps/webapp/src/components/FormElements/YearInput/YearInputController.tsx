"use client";
import React, { FC, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, ControllerProps } from "@/components/FormElements/AutoComplete/Autocomplete";
import { FormFieldControllerWrap } from "@/components/FormElements/Common";
import { InputController } from "@/components/FormElements/Input";
import { YearSelectMinYear } from "@/utils/constants";
import { LabelValue } from "@/utils/types";

export const YearInputController: FC<Omit<ControllerProps, "showSelectedTick" | "options">> = ({
    loading,
    label,
    placeholder,
    required,
    control,
    selectClassNames,
    labelClassNames,
    rootClassName,
    fieldName,
    disabled,
    errorAsTooltip,
    minYear,
    maxYear,
}) => {
    const [years, setYears] = useState<LabelValue[]>([]);

    useEffect(() => {
        setYears(getYearRangeList(minYear, maxYear));
    }, [minYear, maxYear]);

    if (loading || !control) {
        return (
            <InputController
                disabled={true}
                errorAsTooltip={errorAsTooltip}
                fieldName={fieldName}
                inputClassNames={selectClassNames}
                label={label}
                labelClassNames={labelClassNames}
                loading={loading}
                placeholder={placeholder}
                required={required}
                rootClassName={rootClassName}
            />
        );
    }

    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ field, fieldState }) => (
                <FormFieldControllerWrap
                    error={fieldState.error?.message}
                    errorAsTooltip={errorAsTooltip}
                    label={label}
                    labelClassNames={labelClassNames}
                    required={required}
                    rootClassName={rootClassName}
                >
                    <Autocomplete
                        disabled={disabled}
                        error={fieldState.error?.message}
                        fieldName={field.name}
                        options={years}
                        placeholder={placeholder}
                        ref={field.ref}
                        selectClassNames={selectClassNames}
                        setFieldValue={(value: string | number) => field.onChange(value)}
                        showSelectedTick={false}
                        value={field.value}
                        onBlur={field.onBlur}
                    />
                </FormFieldControllerWrap>
            )}
        />
    );
};

const getYearRangeList = (startYear = YearSelectMinYear, endYear = new Date().getFullYear()): LabelValue[] => {
    return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
        const year = endYear - index;
        return {
            value: year.toString(),
            label: year.toString(),
        };
    });
};
