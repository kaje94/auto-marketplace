"use client";
import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "../Common";

export interface ControllerProps extends FormFieldControllerProps, ComponentProps<"input"> {
    inputClassNames?: string;
    loading?: boolean;
    fieldName: string;
    control?: Control<any>;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "rootClassName" | "required" | "fieldName" | "control"> {}

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { error, inputClassNames, loading, ...rest } = props;
    return (
        <input
            ref={ref}
            className={clsx("input-bordered input w-full bg-transparent", error && "input-error", loading && "animate-pulse", inputClassNames)}
            disabled={loading}
            {...rest}
        />
    );
});
Input.displayName = "Input";
