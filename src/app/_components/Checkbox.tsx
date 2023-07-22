"use client";
import { ComponentProps, FC } from "react";
import clsx from "clsx";

interface Props extends ComponentProps<"input"> {
    label?: string;
    inputClassNames?: string;
}

export const Checkbox: FC<Props> = ({ label, inputClassNames, ...rest }) => {
    return (
        <div className="form-control">
            <label className="label cursor-pointer">
                <span className="label-text">{label}</span>
                <input type="checkbox" className={clsx("checkbox", inputClassNames)} {...rest} />
            </label>
        </div>
    );
};
