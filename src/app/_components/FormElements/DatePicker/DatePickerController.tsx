import { AlertCircleIcon } from "@/icons";
import clsx from "clsx";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { DatePicker } from "./DatePicker";
import { ControllerProps } from "./DatePicker";
import { InputController } from "../Input";
import { FormFieldControllerWrap } from "../Common";

export const DatePickerController: FC<ControllerProps> = ({
    loading,
    label,
    placeholderText,
    required,
    control,
    inputClassNames,
    labelClassNames,
    rootClassName,
    fieldName,
    ...rest
}) => {
    if (loading || !control) {
        return (
            <InputController
                label={label}
                placeholder={placeholderText}
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
            render={({ field, fieldState }) => (
                <FormFieldControllerWrap
                    rootClassName={rootClassName}
                    label={label}
                    labelClassNames={labelClassNames}
                    required={required}
                    error={fieldState.error?.message}
                >
                    <DatePicker
                        error={fieldState.error?.message}
                        placeholderText={placeholderText}
                        selected={field.value ? new Date(field.value) : null}
                        onBlur={field.onBlur}
                        {...rest}
                        ref={field.ref}
                        onChange={(date) => field.onChange(date?.toString())}
                    />
                </FormFieldControllerWrap>
            )}
        />
    );
};
