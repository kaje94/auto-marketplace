"use client";
import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";
import { AlertCircleIcon } from "@/icons";

interface Props extends ComponentProps<"textarea"> {
    label?: string;
    textAreaClassNames?: string;
    error?: string;
    loading?: boolean;
    required?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
    const { label, error, textAreaClassNames, loading, required, ...rest } = props;
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
                            "tooltip-error tooltip opacity-100 tooltip-left": error,
                            "opacity-0": !error,
                        })}
                        data-tip={error}
                    >
                        <AlertCircleIcon className="h-4 w-4" />
                    </div>
                </span>
            </label>
            <textarea
                ref={ref}
                className={clsx(
                    "textarea-bordered textarea textarea-md min-h-[140px] w-full bg-transparent",
                    error && "textarea-error",
                    loading && "animate-pulse",
                    textAreaClassNames
                )}
                disabled={loading}
                {...rest}
            />
        </div>
    );
});
TextArea.displayName = "TextArea";
