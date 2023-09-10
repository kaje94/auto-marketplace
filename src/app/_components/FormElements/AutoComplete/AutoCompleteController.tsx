"use client";
import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { Input } from "../../Input";
import { Autocomplete, ControllerProps } from "./Autocomplete";
import { AlertCircleIcon } from "@/icons";
import clsx from "clsx";
import { InputController } from "../Input";

export const AutocompleteController: FC<ControllerProps> = ({
    loading,
    label,
    placeholder,
    required,
    options,
    control,
    inputClassNames,
    labelClassNames,
    rootClassName,
    fieldName,
    setValue,
    gridCols,
    showSelectedTick,
    disabled,
}) => {
    if (loading || !control) {
        return (
            <InputController
                label={label}
                placeholder={placeholder}
                required={required}
                inputClassNames={inputClassNames}
                labelClassNames={labelClassNames}
                rootClassName={rootClassName}
                loading
                fieldName={fieldName}
            />
        );
    }

    return (
        <Controller
            name={fieldName}
            control={control}
            render={({ field, fieldState, formState }) => (
                <div className={clsx("form-control w-full", rootClassName)}>
                    {label && (
                        <label className={clsx("label", labelClassNames)}>
                            <span className="label-text">
                                {label} {required && <span className="text-error">*</span>}
                            </span>
                            <span className="label-text-alt text-error">
                                <div
                                    className={clsx({
                                        "duration-200 flex items-center": true,
                                        "tooltip-left tooltip-error tooltip opacity-100": fieldState.error?.message,
                                        "opacity-0": !fieldState.error?.message,
                                    })}
                                    data-tip={fieldState.error?.message}
                                >
                                    <AlertCircleIcon className="h-4 w-4" />
                                </div>
                            </span>
                        </label>
                    )}

                    <Autocomplete
                        placeholder={placeholder}
                        error={fieldState.error?.message}
                        inputClassNames={inputClassNames}
                        options={options}
                        setFieldValue={(value: string | number) => {
                            if (setValue) {
                                setValue(fieldName, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                            }
                        }}
                        value={field.value}
                        gridCols={gridCols}
                        showSelectedTick={showSelectedTick}
                        disabled={disabled}
                        onBlur={field.onBlur}
                        ref={field.ref}
                    />
                </div>
            )}
        />
    );
};
