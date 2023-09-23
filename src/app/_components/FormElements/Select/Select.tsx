"use client";
import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";
import { Control } from "react-hook-form";
import { LabelValue } from "@/utils/types";
import { unCamelCase } from "@/utils/helpers";
import { FormFieldControllerProps } from "../Common";

export interface ControllerProps extends FormFieldControllerProps, ComponentProps<"select"> {
    selectClassName?: string;
    loading?: boolean;
    fieldName: string;
    control?: Control<any>;
    options?: LabelValue[];
    selectablePlaceholder?: boolean;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "rootClassName" | "required" | "fieldName" | "control"> {}

export const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
    const { error, selectClassName, selectablePlaceholder, placeholder, options = [], loading, ...rest } = props;
    return (
        <select
            disabled={loading}
            ref={ref}
            className={clsx(
                "select-bordered select bg-transparent font-normal",
                error && "select-error",
                loading && "animate-pulse",
                selectClassName
            )}
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
