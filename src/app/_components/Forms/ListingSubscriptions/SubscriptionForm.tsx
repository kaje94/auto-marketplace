"use client";
import { Select, TextArea, Checkbox, TagSelect, Input } from "@/app/_components";
import { CreateSubscriptionReq, VehicleFeature } from "@/utils/types";
import { FC } from "react";
import { FieldError, Controller, UseFormReturn } from "react-hook-form";
import { Dates, SubscriptFrequenciesList, VehicleConditionList, VehicleTypeList, YearSelectMinYear } from "@/utils/constants";
import { AutocompleteController } from "../../FormElements/AutoComplete";
import { DatePickerController } from "../../FormElements/DatePicker";
import { InputController } from "../../FormElements/Input";

interface Props {
    submitButton?: {
        text?: string;
        mutatingText?: string;
        disableIfCleanForm?: boolean;
    };
    isLoading?: boolean;
    isMutating?: boolean;
    form?: UseFormReturn<CreateSubscriptionReq>;
    onMutate?: (values: CreateSubscriptionReq) => void;
}

export const SubscriptionForm: FC<Props> = (props) => {
    const { isMutating, isLoading, form = {}, onMutate = () => {}, submitButton = {} } = props;
    const {
        handleSubmit,
        formState: { errors, isDirty } = {},
        register = () => {},
        setValue,
        control,
    } = form as UseFormReturn<CreateSubscriptionReq>;

    return (
        <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
            <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Subscription Configurations</div>
                        <InputController fieldName="displayName" placeholder="Name of the subscription" label="Display Name" control={control} />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <AutocompleteController
                                label="Subscription Frequency"
                                placeholder="Select Frequency"
                                loading={isLoading}
                                required
                                options={SubscriptFrequenciesList}
                                control={control}
                                fieldName="notificationFrequency"
                                setValue={setValue}
                            />
                            <DatePickerController
                                label="Subscription expiry date"
                                placeholderText="01/01/2025"
                                minDate={Dates.Days_7_from_now}
                                required
                                control={control}
                                fieldName="subscriptionExpiryDate"
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Key Specifications</div>
                        <AutocompleteController
                            label="Type"
                            placeholder="Select Type"
                            required
                            options={VehicleTypeList}
                            control={control}
                            fieldName="type"
                            setValue={setValue}
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController fieldName="brand" placeholder="Toyota, Nissan, Honda, etc" label="Brand" control={control} />
                            <InputController fieldName="model" placeholder="Civic, Sunny, Swift, etc" label="Model" control={control} />
                            <InputController fieldName="trim" placeholder="LX, EX, EX-L, Sport, etc" label="Trim" control={control} />
                            <AutocompleteController
                                label="Condition"
                                placeholder="Select Condition"
                                options={VehicleConditionList}
                                control={control}
                                fieldName="condition"
                                setValue={setValue}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Manufactured Year</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                placeholder="1990"
                                label="Manufactured after"
                                type="number"
                                min={YearSelectMinYear}
                                max={new Date().getFullYear()}
                                fieldName="minYearOfManufacture"
                                control={control}
                            />
                            <InputController
                                placeholder="2000"
                                label="Manufactured before"
                                type="number"
                                min={YearSelectMinYear}
                                max={new Date().getFullYear()}
                                fieldName="maxYearOfManufacture"
                                control={control}
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Registered Year</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                placeholder="2010"
                                label="Registered after"
                                type="number"
                                min={YearSelectMinYear}
                                max={new Date().getFullYear()}
                                fieldName="minYearOfRegistration"
                                control={control}
                            />
                            <InputController
                                placeholder="2020"
                                label="Registered before"
                                type="number"
                                min={YearSelectMinYear}
                                max={new Date().getFullYear()}
                                fieldName="maxYearOfRegistration"
                                control={control}
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Price Range</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                placeholder="1000000"
                                label="Minimum Price"
                                type="number"
                                fieldName="minPrice.amount"
                                control={control}
                            />
                            <InputController
                                placeholder="1000000"
                                label="Maximum Price"
                                type="number"
                                fieldName="maxPrice.amount"
                                control={control}
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Milage</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController placeholder="10000" label="Minimum milage" type="number" fieldName="minMillage" control={control} />
                            <InputController placeholder="1000000" label="Maximum milage" type="number" fieldName="maxMillage" control={control} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex justify-end">
                <button
                    type="submit"
                    className="btn-neutral btn-wide btn"
                    disabled={isMutating || isLoading || (submitButton.disableIfCleanForm && !isDirty)}
                >
                    {isMutating ? submitButton.mutatingText ?? "Loading..." : submitButton.text ?? "Submit"}
                </button>
            </div>
        </form>
    );
};
