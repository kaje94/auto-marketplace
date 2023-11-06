import { clsx } from "clsx";
import { FC, ReactNode } from "react";
import { AlertCircleIcon, XCircleIcon } from "@/icons";

export interface FormFieldControllerProps {
    children?: ReactNode;
    error?: string;
    errorAsTooltip?: boolean;
    label?: string;
    labelClassNames?: string;
    onClearClick?: () => void;
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
    onClearClick,
}) => (
    <div className={clsx("form-control relative w-full", rootClassName, !error && !errorAsTooltip && "mb-4")}>
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

        {onClearClick && (
            <button className="btn btn-circle btn-ghost btn-xs absolute inset-y-0 right-1 my-auto opacity-50 hover:opacity-90" onClick={onClearClick}>
                <XCircleIcon className="h-5 w-5 text-neutral" />
            </button>
        )}
        {children}

        {error && !errorAsTooltip && (
            <label className="label pb-0 pt-0.5">
                <span className="label-text-alt text-xs text-error">{error}</span>
            </label>
        )}
    </div>
);
