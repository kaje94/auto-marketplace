"use client";
import { clsx } from "clsx";
import { ComponentProps, forwardRef, ReactNode } from "react";
import { Control } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { FormFieldControllerProps, InputPrefixSuffixWrap } from "@/components/FormElements/Common";

export interface ControllerProps extends FormFieldControllerProps, ComponentProps<"input"> {
    control?: Control<any>;
    fieldName: string;
    inputClassNames?: string;
    inputPrefix?: ReactNode;
    inputSuffix?: ReactNode;
    loading?: boolean;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "rootClassName" | "required" | "fieldName" | "control"> {}

export const NumberInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { error, inputClassNames, loading, type: _, inputPrefix, inputSuffix, disabled, ...rest } = props;

    return (
        <InputPrefixSuffixWrap disabled={disabled} inputPrefix={inputPrefix} inputSuffix={inputSuffix}>
            <NumericFormat
                className={clsx(
                    "input join-item  input-bordered w-full bg-transparent",
                    error && "input-error",
                    loading && "animate-pulse",
                    inputClassNames,
                )}
                decimalScale={2}
                decimalSeparator="."
                disabled={loading || disabled}
                getInputRef={ref}
                thousandSeparator=","
                {...rest}
                defaultValue={rest.defaultValue as string | number}
                value={rest.value as string | number}
            />
        </InputPrefixSuffixWrap>
    );
});
NumberInput.displayName = "NumberInput";
