"use client";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { Checkbox, ControllerProps } from "./Checkbox";

export const CheckboxController: FC<ControllerProps> = (props) => {
    const { loading, fieldName, control, ...rest } = props;
    if (loading || !control) {
        return (
            <div className="form-control mb-1 mt-2">
                <Checkbox loading={loading} {...rest} ref={undefined} />
            </div>
        );
    }

    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ field, fieldState }) => (
                <div className="form-control mb-1 mt-2">
                    <Checkbox {...rest} {...field} ref={field.ref} />
                </div>
            )}
        />
    );
};
