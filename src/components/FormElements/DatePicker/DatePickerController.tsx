import { FC } from "react";
import { Controller } from "react-hook-form";
import { FormFieldControllerWrap } from "@/components/FormElements/Common";
import { InputController } from "@/components/FormElements/Input";
import { ControllerProps, DatePicker } from "./DatePicker";

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
    errorAsTooltip,
    ...rest
}) => {
    if (loading || !control) {
        return (
            <InputController
                errorAsTooltip={errorAsTooltip}
                fieldName={fieldName}
                inputClassNames={inputClassNames}
                label={label}
                labelClassNames={labelClassNames}
                loading
                placeholder={placeholderText}
                required={required}
                rootClassName={rootClassName}
            />
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
                    <DatePicker
                        error={fieldState.error?.message}
                        onBlur={field.onBlur}
                        placeholderText={placeholderText}
                        selected={field.value ? new Date(field.value) : null}
                        {...rest}
                        onChange={(date) => field.onChange(date?.toString())}
                        ref={field.ref}
                    />
                </FormFieldControllerWrap>
            )}
        />
    );
};
