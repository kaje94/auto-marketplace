import { AlertCircleIcon } from "@/icons";
import { unCamelCase } from "@/utils/helpers";
import { LabelValue } from "@/utils/types";
import clsx from "clsx";
import { ComponentProps, forwardRef } from "react";

interface Props extends ComponentProps<"select"> {
    label?: string;
    selectClassName?: string;
    rootClassName?: string;
    error?: string;
    options?: LabelValue[];
    selectablePlaceholder?: boolean;
    loading?: boolean;
    required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, Props>((props, ref) => {
    const {
        label,
        error,
        options = [],
        selectClassName,
        rootClassName,
        placeholder = "Pick One",
        selectablePlaceholder,
        loading,
        required,
        ...rest
    } = props;
    return (
        <div className={clsx("form-control w-full", rootClassName)}>
            {label && (
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
            )}
            <select
                disabled={loading}
                ref={ref}
                className={clsx("select-bordered select font-normal", error && "select-error", loading && "animate-pulse", selectClassName)}
                {...rest}
            >
                {!rest.value && selectablePlaceholder && (
                    <option disabled={!selectablePlaceholder} value={placeholder}>
                        {placeholder}
                    </option>
                )}

                {options?.map((option) => (
                    <option key={option.value} value={option.value}>
                        {unCamelCase(option.label)}
                    </option>
                ))}
            </select>
        </div>
    );
});
Select.displayName = "Select";
