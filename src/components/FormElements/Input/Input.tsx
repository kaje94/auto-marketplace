"use client";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { ComponentProps, forwardRef } from "react";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "@/components/FormElements/Common";

const NumericFormat = dynamic(() => import("react-number-format").then((mod) => mod.NumericFormat), {
    loading: () => <input className={clsx("input input-bordered w-full animate-pulse bg-transparent")} disabled={true} />,
});

export interface ControllerProps extends FormFieldControllerProps, ComponentProps<"input"> {
    control?: Control<any>;
    fieldName: string;
    inputClassNames?: string;
    loading?: boolean;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "rootClassName" | "required" | "fieldName" | "control"> {}

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { error, inputClassNames, loading, type, ...rest } = props;

    if (type === "number") {
        return (
            <NumericFormat
                className={clsx("input input-bordered w-full bg-transparent", error && "input-error", loading && "animate-pulse", inputClassNames)}
                decimalScale={2}
                decimalSeparator="."
                disabled={loading}
                getInputRef={ref}
                thousandSeparator=","
                {...rest}
                defaultValue={rest.defaultValue as string | number}
                value={rest.value as string | number}
            />
        );
    }
    return (
        <input
            className={clsx("input input-bordered w-full bg-transparent", error && "input-error", loading && "animate-pulse", inputClassNames)}
            disabled={loading}
            ref={ref}
            type={type}
            {...rest}
        />
    );
});
Input.displayName = "Input";
