"use client";
import { Combobox } from "@headlessui/react";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import React, { forwardRef, useState } from "react";
import { Control } from "react-hook-form";
import { FormFieldControllerProps } from "@/components/FormElements/Common";
import { CheckIcon } from "@/icons";
import { unCamelCase } from "@/utils/helpers";
import { LabelValue } from "@/utils/types";

const Virtuoso = dynamic(() => import("react-virtuoso").then((mod) => mod.Virtuoso), {
    loading: () => (
        <div className="flex h-24 items-center justify-center">
            <span className="loading loading-spinner" />
        </div>
    ),
    ssr: false,
});

export interface ControllerProps extends FormFieldControllerProps {
    control: Control<any>;
    disabled?: boolean;
    fieldName: string;
    loading?: boolean;
    maxYear?: number;
    minYear?: number;
    options?: LabelValue[];
    placeholder?: string;
    selectClassNames?: string;
    showSelectedTick?: boolean;
}

export interface Props extends Pick<ControllerProps, "selectClassNames" | "placeholder" | "options" | "showSelectedTick" | "disabled" | "fieldName"> {
    error?: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    setFieldValue?: (value: any) => void;
    value?: string;
}

export const Autocomplete = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { error, selectClassNames, options = [], value, disabled, setFieldValue, showSelectedTick = true, placeholder, onBlur } = props;

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
        <Combobox disabled={disabled} value={value} nullable onChange={setSelectedValue}>
            {({ open }) => (
                <div className="relative">
                    <Combobox.Button className="w-full bg-transparent" onClick={resetQueryIfNoMatch}>
                        <Combobox.Input
                            className={clsx(
                                "select select-bordered w-full bg-transparent font-normal",
                                error && "select-error",
                                disabled && "text-opacity-90",
                                selectClassNames,
                            )}
                            displayValue={(option: any) => (option && option !== "" ? unCamelCase(option as string) : query)}
                            name={props.fieldName}
                            placeholder={placeholder}
                            ref={ref}
                            onBlur={(event) => {
                                setTimeout(() => {
                                    if (onBlur) {
                                        onBlur(event);
                                    }
                                }, 200);
                            }}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </Combobox.Button>

                    {open && (
                        <div className={clsx("dropdown dropdown-end dropdown-open absolute inset-x-0 bottom-0 w-full")}>
                            <div className={clsx("menu dropdown-content z-20 mt-0.5 grid w-full rounded rounded-t-none bg-base-200 p-0 shadow-lg")}>
                                {filteredOptions.length === 0 && query !== "" ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-neutral">Nothing found.</div>
                                ) : (
                                    <Combobox.Options className="h-fit">
                                        <Virtuoso
                                            className="overflow-y-auto"
                                            itemContent={(index) => {
                                                const option = filteredOptions[index];
                                                if (option === undefined) {
                                                    return null;
                                                }
                                                return (
                                                    <Combobox.Option
                                                        key={option.value}
                                                        className={({ active, selected }) =>
                                                            clsx({
                                                                "hover:bg-base-200 w-full truncate line-clamp-1 overflow-hidden": true,
                                                                "font-bold": selected,
                                                                "bg-base-300 hover:bg-base-300": active,
                                                            })
                                                        }
                                                        value={option.value}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            setSelectedValue(option.value);
                                                        }}
                                                    >
                                                        {({ selected }) => (
                                                            <div className="flex flex-1 items-center justify-between">
                                                                <span className={clsx(`flex-1 truncate`, selected ? "font-bold" : "font-normal")}>
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
                                                );
                                            }}
                                            style={{ height: filteredOptions.length > 6 ? 240 : 36 * filteredOptions.length }}
                                            totalCount={filteredOptions.length}
                                        />
                                    </Combobox.Options>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Combobox>
    );
});
Autocomplete.displayName = "Autocomplete";
