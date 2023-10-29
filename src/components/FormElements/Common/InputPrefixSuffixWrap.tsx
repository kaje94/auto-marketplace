import { clsx } from "clsx";
import { FC, ReactNode } from "react";

interface Props {
    children: ReactNode;
    disabled?: boolean;
    inputPrefix?: ReactNode;
    inputSuffix?: ReactNode;
}

export const InputPrefixSuffixWrap: FC<Props> = ({ children, inputPrefix, inputSuffix, disabled }) => {
    return (
        <div className="join join-horizontal w-full">
            {inputPrefix && (
                <span className={clsx("join-item flex items-center bg-base-200 px-3 py-1", !disabled && "border-[1px] border-r-0 border-base-300")}>
                    {inputPrefix}
                </span>
            )}
            {children}
            {inputSuffix && (
                <span className={clsx("join-item flex items-center bg-base-200 px-3 py-1", !disabled && "border-[1px] border-l-0 border-base-300")}>
                    {inputSuffix}
                </span>
            )}
        </div>
    );
};
