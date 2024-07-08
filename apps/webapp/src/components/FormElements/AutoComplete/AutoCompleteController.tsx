"use client";
import React, { FC } from "react";
import { Controller } from "react-hook-form";
import { FormFieldControllerWrap } from "@/components/FormElements/Common";
import { InputController } from "@/components/FormElements/Input";
import { Autocomplete, ControllerProps } from "./Autocomplete";

export const AutocompleteController: FC<ControllerProps> = (props) => {
    const {
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
        showSelectedTick,
        disabled,
        errorAsTooltip,
    } = props;
    if (loading || !control) {
        return (
            <InputController
                disabled={true}
                errorAsTooltip={errorAsTooltip}
                fieldName={fieldName}
                inputClassNames={selectClassNames}
                label={label}
                labelClassNames={labelClassNames}
                loading={loading}
                placeholder={placeholder}
                required={required}
                rootClassName={rootClassName}
            />
        );
    }

    if (options?.length === 0) {
        return <InputController {...props} inputClassNames={props?.selectClassNames?.includes("select-sm") ? "input-sm" : ""} />;
    }

    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ field, fieldState }) => (
                <FormFieldControllerWrap
                    error={fieldState.error?.message}
                    errorAsTooltip={errorAsTooltip}
                    label={label}
                    labelClassNames={labelClassNames}
                    required={required}
                    rootClassName={rootClassName}
                >
                    <Autocomplete
                        disabled={disabled}
                        error={fieldState.error?.message}
                        fieldName={field.name}
                        options={options}
                        placeholder={placeholder}
                        ref={field.ref}
                        selectClassNames={selectClassNames}
                        setFieldValue={(value: string | number) => field.onChange(value)}
                        showSelectedTick={showSelectedTick}
                        value={field.value}
                        onBlur={field.onBlur}
                    />
                </FormFieldControllerWrap>
            )}
        />
    );
};
