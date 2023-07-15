"use client";
import { ComponentProps, FC } from "react";
import clsx from "clsx";

interface Props extends ComponentProps<"textarea"> {
    label?: string;
    textAreaClassNames?: string;
    error?: string;
}

export const TextArea: FC<Props> = ({ label, error, textAreaClassNames, ...rest }) => {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <textarea
                className={clsx("textarea-bordered textarea textarea-md min-h-[140px] w-full", error && "textarea-error", textAreaClassNames)}
                {...rest}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};
