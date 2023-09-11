"use client";
import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";
import { Control } from "react-hook-form";

export interface ControllerProps extends ComponentProps<"textarea"> {
    label?: string;
    textAreaClassNames?: string;
    labelClassNames?: string;
    rootClassName?: string;
    error?: string;
    loading?: boolean;
    required?: boolean;
    fieldName: string;
    control?: Control<any>;
}

export interface Props extends Omit<ControllerProps, "label" | "labelClassNames" | "rootClassName" | "required" | "fieldName" | "control"> {}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
    const { error, loading, textAreaClassNames, ...rest } = props;
    return (
        <textarea
            ref={ref}
            className={clsx(
                "textarea-bordered textarea textarea-md min-h-[140px] w-full bg-transparent",
                error && "textarea-error",
                loading && "animate-pulse",
                textAreaClassNames
            )}
            {...rest}
        />
    );
});
TextArea.displayName = "TextArea";
