"use client";
import { Combobox } from "@headlessui/react";
import { clsx } from "clsx";
import React, { forwardRef, useState } from "react";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "@/components/FormElements/Common";
import { CheckIcon } from "@/icons";
import { unCamelCase } from "@/utils/helpers";
import { LabelValue } from "@/utils/types";

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
    value?: string;
}

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

    const [query, setQuery] = useState("");

    const filteredOptions =
        query === ""
            ? options
            : options.filter((option) => option.label.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")));

    const resetQueryIfNoMatch = () => {
        if (query?.length > 0 && filteredOptions?.length === 0) {
            setQuery("");
        }
    };

    const setSelectedValue = (newValue: string | number) => {
        if (setFieldValue) {
            setFieldValue(newValue);
        }
    };

    return (
        <Combobox disabled={disabled} nullable onChange={setSelectedValue} value={value}>
            {({ open }) => (
                <div className="relative">
                    <Combobox.Button className="w-full bg-transparent" onClick={resetQueryIfNoMatch}>
                        <Combobox.Input
                            className={clsx(
                                "select-bordered select w-full bg-transparent font-normal",
                                error && "select-error",
                                disabled && "text-opacity-90",
                                selectClassNames,
                            )}
                            displayValue={(option: any) => (option && option !== "" ? unCamelCase(option as string) : query)}
                            onBlur={(event) => {
                                setTimeout(() => {
                                    if (onBlur) {
                                        onBlur(event);
                                    }
                                }, 200);
                            }}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={placeholder}
                            ref={ref}
                        />
                    </Combobox.Button>

                    <div className={clsx("dropdown-end dropdown absolute inset-x-0 bottom-0 w-full", open && "dropdown-open")}>
                        <div
                            className={clsx(
                                "dropdown-content menu z-[1] mt-1 grid max-h-60 w-full overflow-y-auto rounded rounded-t-none bg-base-200 shadow-lg",
                                gridCols,
                            )}
                        >
                            {filteredOptions.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-neutral">Nothing found.</div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <Combobox.Option
                                        key={option.value}
                                        className={({ active, selected }) =>
                                            clsx({
                                                "hover:bg-base-200": true,
                                                "font-bold": selected,
                                                "bg-base-300 hover:bg-base-300": active,
                                            })
                                        }
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedValue(option.value);
                                        }}
                                        value={option.value}
                                    >
                                        {({ selected }) => (
                                            <div className="flex flex-1 items-center justify-between">
                                                <span
                                                    className={clsx(
                                                        `flex-1 truncate`,
                                                        selected ? "font-bold" : "font-normal",
                                                        gridCols !== "grid-cols-1" && "text-center",
                                                    )}
                                                >
                                                    {unCamelCase(option.label)}
                                                </span>
                                                {showSelectedTick && selected ? (
                                                    <span className="inset-y-0 flex items-center pl-2 text-neutral">
                                                        <CheckIcon className="h-5 w-5" />
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Combobox>
    );
});
Autocomplete.displayName = "Autocomplete";