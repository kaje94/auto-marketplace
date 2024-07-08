"use client";
import { clsx } from "clsx";
import { ComponentProps, forwardRef } from "react";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "@/components/FormElements/Common";

export interface ControllerProps extends FormFieldControllerProps, ComponentProps<"textarea"> {
    control?: Control<any>;
    fieldName: string;
    loading?: boolean;
    textAreaClassNames?: string;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "rootClassName" | "required" | "fieldName" | "control"> {}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
    const { error, loading, textAreaClassNames, disabled, ...rest } = props;
    return (
        <textarea
            className={clsx(
                "textarea textarea-bordered textarea-md min-h-[200px] w-full bg-transparent",
                error && "textarea-error",
                loading && "animate-pulse",
                textAreaClassNames,
            )}
            disabled={loading || disabled}
            ref={ref}
            {...rest}
        />
    );
});
TextArea.displayName = "TextArea";
