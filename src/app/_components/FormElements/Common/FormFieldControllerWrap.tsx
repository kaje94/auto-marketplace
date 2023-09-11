import { AlertCircleIcon } from "@/icons";
import clsx from "clsx";
import { FC, ReactNode } from "react";

interface Props {
    error?: string;
    required?: boolean;
    labelClassNames?: string;
    label?: string;
    rootClassName?: string;
    children?: ReactNode;
}

export const FormFieldControllerWrap: FC<Props> = ({ children, rootClassName, label, labelClassNames, required, error }) => (
    <div className={clsx("form-control w-full", rootClassName, !error && "mb-4")}>
        <label className={clsx("label py-0.5", labelClassNames)}>
            <span className="label-text ">
                {label} {required && <span className="text-error">*</span>}
            </span>
        </label>
        {children}
        {error && (
            <label className="label pb-0 pt-0.5">
                <span className="label-text-alt text-xs text-error">{error}</span>
            </label>
        )}
    </div>
);
