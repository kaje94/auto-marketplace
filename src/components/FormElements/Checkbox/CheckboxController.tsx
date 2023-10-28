"use client";
import { FC } from "react";
import { Controller } from "react-hook-form";
import { Checkbox, ControllerProps } from "./Checkbox";

export const CheckboxController: FC<ControllerProps> = (props) => {
    const { loading, fieldName, control, ...rest } = props;
    if (loading || !control) {
        return (
            <div className="form-control my-1 animate-pulse lg:mt-3">
                <Checkbox loading={loading} {...rest} ref={undefined} />
            </div>
        );
    }

    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ field }) => (
                <div className="form-control my-1 lg:mt-3">
                    <Checkbox {...rest} {...field} checked={field.value} ref={field.ref} />
                </div>
            )}
        />
    );
};
