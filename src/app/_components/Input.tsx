"use client";
import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";
import { AlertCircleIcon } from "@/icons";

export interface Props extends ComponentProps<"input"> {
    label?: string;
    inputClassNames?: string;
    labelClassNames?: string;
    rootClassName?: string;
    error?: string;
    loading?: boolean;
    required?: boolean;
}
// todo: remove and replace with Input controller
export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, error, inputClassNames, labelClassNames, rootClassName, loading, required, ...rest } = props;
    return (
        <div className={clsx("form-control w-full", rootClassName)}>
            <label className={clsx("label", labelClassNames)}>
                <span className="label-text">
                    {label} {required && <span className="text-error">*</span>}
                </span>
                <span className="label-text-alt text-error">
                    <div
                        className={clsx({
                            "duration-200 flex items-center": true,
                            "tooltip-left tooltip-error tooltip opacity-100": error,
                            "opacity-0": !error,
                        })}
                        data-tip={error}
                    >
                        <AlertCircleIcon className="h-4 w-4" />
                    </div>
                </span>
            </label>
            <input
                ref={ref}
                className={clsx("input-bordered input w-full bg-transparent", error && "input-error", loading && "animate-pulse", inputClassNames)}
                disabled={loading}
                {...rest}
            />
        </div>
    );
});
Input.displayName = "Input";
