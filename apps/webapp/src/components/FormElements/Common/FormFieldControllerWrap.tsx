import { clsx } from "clsx";
import { FC, ReactNode } from "react";
import { AlertCircleIcon } from "@/icons";

export interface FormFieldControllerProps {
    children?: ReactNode;
    error?: string;
    errorAsTooltip?: boolean;
    label?: string;
    labelClassNames?: string;
    required?: boolean;
    rootClassName?: string;
}

export const FormFieldControllerWrap: FC<FormFieldControllerProps> = ({
    children,
    rootClassName,
    label,
    labelClassNames,
    required,
    error,
    errorAsTooltip,
}) => (
    <div
        className={clsx("form-control relative w-full", rootClassName, !error && !errorAsTooltip && "mb-4")}
        data-testid={error ? `form-field-error-${label}` : `form-field-no-error-${label}`}
    >
        {label && (
            <label className={clsx("label py-0.5", labelClassNames)}>
                <span className="label-text opacity-70">
                    {label} {required && <span className="text-error">*</span>}
                </span>
                {errorAsTooltip && (
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
                )}
            </label>
        )}

        {children}

        {error && !errorAsTooltip && (
            <label className="label pb-0 pt-0.5">
                <span className="label-text-alt text-xs text-error">{error}</span>
            </label>
        )}
    </div>
);
