"use client";
import { clsx } from "clsx";
import { ComponentProps, forwardRef } from "react";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "@/components/FormElements/Common";
import { unCamelCase } from "@/utils/helpers";
import { LabelValue } from "@/utils/types";

export interface ControllerProps extends FormFieldControllerProps, ComponentProps<"select"> {
    control?: Control<any>;
    fieldName: string;
    loading?: boolean;
    options?: LabelValue[];
    placeholder?: string;
    selectClassName?: string;
    selectablePlaceholder?: boolean;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "rootClassName" | "required" | "fieldName" | "control"> {}

export const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
    const { error, selectClassName, selectablePlaceholder, placeholder, options = [], loading, disabled, ...rest } = props;
    return (
        <select
            className={clsx(
                "select select-bordered bg-transparent font-normal",
                error && "select-error",
                loading && "animate-pulse",
                selectClassName,
            )}
            disabled={loading || disabled}
            ref={ref}
            {...rest}
        >
            {selectablePlaceholder && (
                <option disabled={!selectablePlaceholder} value={""}>
                    {placeholder}
                </option>
            )}

            {options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {unCamelCase(option.label)}
                </option>
            ))}
        </select>
    );
});
Select.displayName = "Select";
