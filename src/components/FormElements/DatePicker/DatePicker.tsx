"use client";
import { FC, forwardRef } from "react";
import clsx from "clsx";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "@/components/FormElements/Common";

export interface ControllerProps extends FormFieldControllerProps, Omit<ReactDatePickerProps, "onChange"> {
    inputClassNames?: string;
    loading?: boolean;
    fieldName: string;
    control: Control<any>;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "loading" | "required" | "control" | "fieldName"> {
    onChange: (date: Date | null) => void;
}

export const DatePicker = forwardRef<ReactDatePicker, Props>((props, ref) => {
    const { error, inputClassNames, ...rest } = props;
    return (
        <ReactDatePicker
            className={clsx("input-bordered input w-full bg-transparent", error && "input-error", inputClassNames)}
            {...rest}
            ref={ref}
        />
    );
});
DatePicker.displayName = "DatePicker";
