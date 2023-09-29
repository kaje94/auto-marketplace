"use client";
import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { FormFieldControllerWrap } from "@/components/FormElements/Common";
import { InputController } from "@/components/FormElements/Input";
import { Autocomplete, ControllerProps } from "./Autocomplete";

export const AutocompleteController: FC<ControllerProps> = ({
    loading,
    label,
    placeholder,
    required,
    options,
    control,
    selectClassNames,
    labelClassNames,
    rootClassName,
    fieldName,
    gridCols,
    showSelectedTick,
    disabled,
    errorAsTooltip,
}) => {
    if (loading || !control) {
        return (
            <InputController
                label={label}
                placeholder={placeholder}
                required={required}
                inputClassNames={selectClassNames}
                labelClassNames={labelClassNames}
                rootClassName={rootClassName}
                loading={loading}
                disabled={true}
                fieldName={fieldName}
                errorAsTooltip={errorAsTooltip}
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
                    errorAsTooltip={errorAsTooltip}
                >
                    <Autocomplete
                        placeholder={placeholder}
                        error={fieldState.error?.message}
                        selectClassNames={selectClassNames}
                        options={options}
                        setFieldValue={(value: string | number) => field.onChange(value)}
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
