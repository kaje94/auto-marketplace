"use client";
import { clsx } from "clsx";
import { forwardRef } from "react";
// eslint-disable-next-line import/no-named-as-default
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "@/components/FormElements/Common";
import "react-datepicker/dist/react-datepicker.css";

export interface ControllerProps extends FormFieldControllerProps, Omit<ReactDatePickerProps, "onChange"> {
    control: Control<any>;
    fieldName: string;
    inputClassNames?: string;
    loading?: boolean;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "loading" | "required" | "control" | "fieldName"> {
    onChange: (date: Date | null) => void;
}

export const DatePicker = forwardRef<ReactDatePicker, Props>((props, ref) => {
    const { error, inputClassNames, ...rest } = props;
    return (
        <ReactDatePicker
            className={clsx("input input-bordered w-full bg-transparent", error && "input-error", inputClassNames)}
            {...rest}
            ref={ref}
        />
    );
});
DatePicker.displayName = "DatePicker";
