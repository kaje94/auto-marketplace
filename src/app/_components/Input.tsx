"use client";
import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";
import { AlertCircleIcon } from "@/icons";

interface Props extends ComponentProps<"input"> {
    label?: string;
    inputClassNames?: string;
    error?: string;
    loading?: boolean;
    required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, error, inputClassNames, loading, required, ...rest } = props;
    return (
        <div className="form-control w-full">
            <label className="label">
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
                className={clsx("input-bordered input w-full", error && "input-error", loading && "animate-pulse", inputClassNames)}
                disabled={loading}
                {...rest}
            />
        </div>
    );
});
Input.displayName = "Input";
