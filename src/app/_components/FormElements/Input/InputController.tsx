"use client";
import { FC, ReactNode } from "react";
import clsx from "clsx";
import { AlertCircleIcon } from "@/icons";
import { ControllerProps, Input } from "./Input";
import { Controller } from "react-hook-form";

export const InputController: FC<ControllerProps> = (props) => {
    const { label, inputClassNames, labelClassNames, rootClassName, loading, required, fieldName, control, ...rest } = props;
    if (loading || !control) {
        <InputControllerWrap rootClassName={rootClassName} label={label} labelClassNames={labelClassNames} required={required}>
            <input className={clsx("input-bordered input w-full animate-pulse bg-transparent", inputClassNames)} disabled={loading} {...rest} />
        </InputControllerWrap>;
    }

    return (
        <Controller
            name={fieldName}
            control={control}
            render={({ field, fieldState }) => (
                <InputControllerWrap
                    rootClassName={rootClassName}
                    label={label}
                    labelClassNames={labelClassNames}
                    required={required}
                    error={fieldState.error?.message}
                >
                    <Input
                        className={clsx(
                            "input-bordered input w-full bg-transparent",
                            fieldState.error?.message && "input-error",
                            loading && "animate-pulse",
                            inputClassNames
                        )}
                        disabled={loading}
                        loading={loading}
                        {...rest}
                        {...field}
                        ref={field.ref}
                    />
                </InputControllerWrap>
            )}
        />
    );
};

const InputControllerWrap: FC<Omit<ControllerProps, "fieldName" | "control"> & { children?: ReactNode }> = ({
    children,
    rootClassName,
    label,
    labelClassNames,
    required,
    error,
}) => (
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
        {children}
    </div>
);
