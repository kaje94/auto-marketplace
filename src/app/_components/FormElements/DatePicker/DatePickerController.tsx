import { AlertCircleIcon } from "@/icons";
import clsx from "clsx";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { Input } from "../../Input";
import { DatePicker } from "./DatePicker";
import { ControllerProps } from "./DatePicker";
import { InputController } from "../Input";

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
                <div className="form-control w-full">
                    <label className={clsx("label", labelClassNames)}>
                        <span className="label-text">
                            {label} {required && <span className="text-error">*</span>}
                        </span>
                        <span className="label-text-alt text-error">
                            <div
                                className={clsx({
                                    "duration-200 flex items-center": true,
                                    "tooltip-left tooltip-error tooltip opacity-100": fieldState.error?.message,
                                    "opacity-0": !fieldState.error?.message,
                                })}
                                data-tip={fieldState.error?.message}
                            >
                                <AlertCircleIcon className="h-4 w-4" />
                            </div>
                        </span>
                    </label>

                    <input ref={field.ref} className="h-0 w-0" />

                    <DatePicker
                        className={clsx(
                            "input-bordered input w-full bg-transparent",
                            fieldState.error?.message && "input-error",
                            loading && "animate-pulse",
                            inputClassNames
                        )}
                        placeholderText={placeholderText}
                        selected={field.value ? new Date(field.value) : null}
                        onBlur={field.onBlur}
                        {...rest}
                        onChange={(date) => field.onChange(date?.toString())}
                    />
                </div>
            )}
        />
    );
};
