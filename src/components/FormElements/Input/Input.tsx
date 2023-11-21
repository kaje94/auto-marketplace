"use client";
import { clsx } from "clsx";
import { ComponentProps, forwardRef, ReactNode } from "react";
import { Control } from "react-hook-form";
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

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { error, inputClassNames, loading, type, inputPrefix, inputSuffix, disabled, ...rest } = props;

    return (
        <InputPrefixSuffixWrap disabled={disabled} inputPrefix={inputPrefix} inputSuffix={inputSuffix}>
            <input
                className={clsx(
                    "input join-item input-bordered w-full flex-1 bg-transparent",
                    error && "input-error",
                    loading && "animate-pulse",
                    inputClassNames,
                )}
                disabled={loading || disabled}
                ref={ref}
                type={type}
                {...rest}
            />
        </InputPrefixSuffixWrap>
    );
});
Input.displayName = "Input";
