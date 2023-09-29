"use client";
import { clsx } from "clsx";
import { ComponentProps, forwardRef } from "react";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "@/components/FormElements/Common";

export interface ControllerProps extends FormFieldControllerProps, ComponentProps<"textarea"> {
    textAreaClassNames?: string;
    loading?: boolean;
    fieldName: string;
    control?: Control<any>;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "rootClassName" | "required" | "fieldName" | "control"> {}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
    const { error, loading, textAreaClassNames, ...rest } = props;
    return (
        <textarea
            className={clsx(
                "textarea-bordered textarea textarea-md min-h-[140px] w-full bg-transparent",
                error && "textarea-error",
                loading && "animate-pulse",
                textAreaClassNames,
            )}
            ref={ref}
            {...rest}
        />
    );
});
TextArea.displayName = "TextArea";
