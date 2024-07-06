"use client";
import { clsx } from "clsx";
import { ComponentProps, forwardRef } from "react";
import { Control } from "react-hook-form";

export interface ControllerProps extends ComponentProps<"input"> {
    checkboxClassNames?: string;
    control?: Control<any>;
    fieldName: string;
    label?: string;
    loading?: boolean;
}

export interface Props extends Omit<ControllerProps, "fieldName" | "control"> {}

export const Checkbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, checkboxClassNames, loading, disabled, ...rest } = props;
    return (
        <label
            className={clsx(
                "label rounded-lg border-2 border-opacity-50 py-3 duration-200 hover:bg-base-200 hover:bg-opacity-50",
                !loading && !disabled && "cursor-pointer",
                disabled && "cursor-not-allowed opacity-50",
                loading && "animate-pulse !bg-base-300",
            )}
            onClick={(event) => event.stopPropagation()}
        >
            <span className="label-text mr-1">{label}</span>
            <input
                className={clsx("checkbox checkbox-md border-2", checkboxClassNames)}
                disabled={loading || disabled}
                ref={ref}
                type="checkbox"
                {...rest}
            />
        </label>
    );
});
Checkbox.displayName = "Checkbox";
