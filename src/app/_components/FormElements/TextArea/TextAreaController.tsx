"use client";
import { FC } from "react";
import { ControllerProps, TextArea } from "./TextArea";
import { Controller } from "react-hook-form";
import { FormFieldControllerWrap } from "../Common";

export const TextAreaController: FC<ControllerProps> = (props) => {
    const { label, labelClassNames, rootClassName, loading, required, fieldName, control, ...rest } = props;
    if (loading || !control) {
        return (
            <FormFieldControllerWrap rootClassName={rootClassName} label={label} labelClassNames={labelClassNames} required={required}>
                <TextArea loading={loading} disabled {...rest} ref={undefined} />
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
                >
                    <TextArea loading={loading} error={fieldState.error?.message} {...rest} {...field} ref={field.ref} />
                </FormFieldControllerWrap>
            )}
        />
    );
};
