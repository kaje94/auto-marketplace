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
                label={label}
                placeholder={placeholderText}
                required={required}
                inputClassNames={inputClassNames}
                labelClassNames={labelClassNames}
                rootClassName={rootClassName}
                loading
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
