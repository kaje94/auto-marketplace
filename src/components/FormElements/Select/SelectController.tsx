"use client";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { FormFieldControllerWrap } from "@/components/FormElements/Common";
import { ControllerProps, Select } from "./Select";

export const SelectController: FC<ControllerProps> = (props) => {
    const { label, labelClassNames, rootClassName, loading, required, fieldName, control, errorAsTooltip, ...rest } = props;
    if (loading || !control) {
        return (
            <FormFieldControllerWrap
                errorAsTooltip={errorAsTooltip}
                label={label}
                labelClassNames={labelClassNames}
                required={required}
                rootClassName={rootClassName}
            >
                <Select disabled={loading} loading={loading} {...rest} ref={undefined} />
            </FormFieldControllerWrap>
        );
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
                    <Select disabled={loading} error={fieldState.error?.message} loading={loading} {...rest} {...field} ref={field.ref} />
                </FormFieldControllerWrap>
            )}
        />
    );
};
