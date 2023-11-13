"use client";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import { clsx } from "clsx";
import React, { forwardRef } from "react";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "@/components/FormElements/Common";
import { CheckIcon } from "@/icons";
import { unCamelCase } from "@/utils/helpers";
import { LabelValue } from "@/utils/types";
import useForkRef from "./useForkRef";

export interface ControllerProps extends FormFieldControllerProps {
    control: Control<any>;
    disabled?: boolean;
    fieldName: string;
    gridCols?: "grid-cols-3" | "grid-cols-1";
    loading?: boolean;
    options?: LabelValue[];
    placeholder?: string;
    selectClassNames?: string;
    showSelectedTick?: boolean;
}

export interface Props extends Pick<ControllerProps, "selectClassNames" | "placeholder" | "options" | "gridCols" | "showSelectedTick" | "disabled"> {
    error?: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    setFieldValue?: (value: any) => void;
    value?: LabelValue;
}

/*
todo:
useAutocomplete.js:210 MUI: The value provided to useAutocomplete is invalid.
None of the options match with `"2010"`.
You can use the `isOptionEqualToValue` prop to customize the equality test.
*/

export const Autocomplete = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const {
        error,
        selectClassNames,
        options = [],
        value,
        disabled,
        setFieldValue,
        gridCols = "grid-cols-1",
        showSelectedTick = true,
        placeholder,
        onBlur,
    } = props;

    const { getRootProps, getInputProps, getListboxProps, getOptionProps, anchorEl, setAnchorEl, groupedOptions, expanded, popupOpen } =
        useAutocomplete({
            options,
            onChange: (_, value) => {
                if (setFieldValue) {
                    setFieldValue(value?.value || "");
                }
            },
            onClose: (event) => {
                if (onBlur) {
                    onBlur(event as React.FocusEvent<HTMLInputElement>);
                }
            },
            autoComplete: true,
            value,
        });

    const rootRef = useForkRef(setAnchorEl);

    const inputRef = useForkRef(ref, getInputProps().ref);

    return (
        <div className="relative">
            <div {...getRootProps()} ref={rootRef}>
                <input
                    className={clsx(
                        "select select-bordered w-full bg-transparent font-normal",
                        error && "select-error",
                        disabled && "text-opacity-90",
                        selectClassNames,
                    )}
                    placeholder={placeholder}
                    {...getInputProps()}
                    ref={inputRef}
                />
            </div>
            {anchorEl && expanded && (
                <div className={clsx("dropdown-end dropdown-open dropdown absolute inset-x-0 bottom-0 w-full")}>
                    <ul
                        {...getListboxProps()}
                        className={clsx(
                            "menu dropdown-content z-[1] mt-1 grid max-h-60 w-full overflow-y-auto rounded rounded-t-none bg-base-200 p-0.5 shadow-lg",
                            gridCols,
                        )}
                    >
                        {groupedOptions?.length > 0 ? (
                            groupedOptions.map((option, index) => {
                                const selected = value?.value === (option as LabelValue).value;
                                return (
                                    <li
                                        className={clsx({
                                            "hover:bg-base-200 w-full truncate line-clamp-1 overflow-hidden": true,
                                            "font-bold": selected,
                                        })}
                                        {...getOptionProps({ option: option as LabelValue, index })}
                                        key={(option as LabelValue)?.value}
                                    >
                                        <div className="flex flex-1 items-center justify-between">
                                            <span
                                                className={clsx(
                                                    `flex-1 truncate`,
                                                    selected ? "font-bold" : "font-normal",
                                                    gridCols !== "grid-cols-1" && "text-center",
                                                )}
                                            >
                                                {unCamelCase((option as LabelValue).label)}
                                            </span>
                                            {showSelectedTick && selected ? (
                                                <span className="inset-y-0 flex items-center pl-2 text-neutral">
                                                    <CheckIcon className="h-5 w-5" />
                                                </span>
                                            ) : null}
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <div className="relative cursor-default select-none px-4 py-2 text-neutral">Nothing found.</div>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
});
Autocomplete.displayName = "Autocomplete";
