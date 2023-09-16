"use client";
import { FC } from "react";
import { ControllerProps, TextArea } from "./TextArea";
import { Controller } from "react-hook-form";
import { FormFieldControllerWrap } from "../Common";

export const TextAreaController: FC<ControllerProps> = (props) => {
    const { label, labelClassNames, rootClassName, loading, required, fieldName, control, errorAsTooltip, ...rest } = props;
    if (loading || !control) {
        return (
            <FormFieldControllerWrap
                rootClassName={rootClassName}
                label={label}
                labelClassNames={labelClassNames}
                required={required}
                errorAsTooltip={errorAsTooltip}
            >
                <TextArea disabled={loading} loading={loading} {...rest} ref={undefined} />
            </FormFieldControllerWrap>
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
                    <TextArea loading={loading} error={fieldState.error?.message} {...rest} {...field} ref={field.ref} />
                </FormFieldControllerWrap>
            )}
        />
    );
};
