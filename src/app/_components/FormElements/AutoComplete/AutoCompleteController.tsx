"use client";
import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, ControllerProps } from "./Autocomplete";
import { AlertCircleIcon } from "@/icons";
import clsx from "clsx";
import { InputController } from "../Input";
import { FormFieldControllerWrap } from "../Common";

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
                loading={loading}
                disabled={true}
                fieldName={fieldName}
            />
        );
    }

    return (
        <Controller
            name={fieldName}
            control={control}
            render={({ field, fieldState }) => (
                <FormFieldControllerWrap
                    rootClassName={rootClassName}
                    label={label}
                    labelClassNames={labelClassNames}
                    required={required}
                    error={fieldState.error?.message}
                >
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
                </FormFieldControllerWrap>
            )}
        />
    );
};
