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
                placeholder={placeholderText}
                required={required}
                rootClassName={rootClassName}
                loading
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
                        placeholderText={placeholderText}
                        selected={field.value ? new Date(field.value) : null}
                        onBlur={field.onBlur}
                        {...rest}
                        name={field.name}
                        ref={field.ref}
                        onChange={(date) => field.onChange(date?.toString())}
                    />
                </FormFieldControllerWrap>
            )}
        />
    );
};
