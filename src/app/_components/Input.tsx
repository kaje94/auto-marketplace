"use client";
import { ComponentProps, FC } from "react";
import clsx from "clsx";

interface Props extends ComponentProps<"input"> {
    label?: string;
    inputClassNames?: string;
    error?: string;
}

export const Input: FC<Props> = ({ label, error, inputClassNames, ...rest }) => {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>
            <input className={clsx("input-bordered input w-full", error && "input-error", inputClassNames)} {...rest} />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
};
