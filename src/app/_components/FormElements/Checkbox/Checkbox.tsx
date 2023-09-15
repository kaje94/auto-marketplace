"use client";
import { ComponentProps, FC, forwardRef } from "react";
import clsx from "clsx";
import { Control } from "react-hook-form";

export interface ControllerProps extends ComponentProps<"input"> {
    label?: string;
    checkboxClassNames?: string;
    loading?: boolean;
    fieldName: string;
    control?: Control<any>;
}

export interface Props extends Omit<ControllerProps, "fieldName" | "control"> {}

export const Checkbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, checkboxClassNames, loading, ...rest } = props;
    return (
        <div className="form-control mb-1 mt-2">
            <label className={clsx("label", !loading && "cursor-pointer")}>
                <span className="label-text">{label}</span>
                <input
                    ref={ref}
                    disabled={loading}
                    type="checkbox"
                    className={clsx("checkbox", loading && "animate-pulse", checkboxClassNames)}
                    {...rest}
                />
            </label>
        </div>
    );
});
Checkbox.displayName = "Checkbox";