"use client";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { DatePickerController } from "@/components/FormElements/DatePicker";
import { InputController } from "@/components/FormElements/Input";
import { NumberInputController } from "@/components/FormElements/NumberInput";
import { YearInputController } from "@/components/FormElements/YearInput";
import { Dates, SubscriptFrequenciesList, VehicleConditionList, VehicleTypeList, YearSelectMinYear } from "@/utils/constants";
import { CreateSubscriptionReq } from "@/utils/types";

interface Props {
    form?: UseFormReturn<CreateSubscriptionReq>;
    isLoading?: boolean;
    isMutating?: boolean;
    onMutate?: (values: CreateSubscriptionReq) => void;
    submitButton?: {
        disableIfCleanForm?: boolean;
        mutatingText?: string;
        text?: string;
    };
}

export const SubscriptionForm: FC<Props> = (props) => {
    const { isMutating, isLoading, form = {}, onMutate = () => {}, submitButton = {} } = props;
    const { handleSubmit, formState: { isDirty } = {}, control } = form as UseFormReturn<CreateSubscriptionReq>;

    return (
        <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
            <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Subscription Configurations</div>
                        <InputController
                            control={control}
                            fieldName="displayName"
                            label="Display Name"
                            loading={isLoading}
                            placeholder="Name of the subscription"
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <AutocompleteController
                                control={control}
                                fieldName="notificationFrequency"
                                label="Subscription Frequency"
                                loading={isLoading}
                                options={SubscriptFrequenciesList}
                                placeholder="Select Frequency"
                                required
                            />
                            <DatePickerController
                                control={control}
                                fieldName="subscriptionExpiryDate"
                                label="Subscription expiry date"
                                loading={isLoading}
                                minDate={Dates.Days_7_from_now}
                                placeholderText="01/01/2025"
                                required
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Key Specifications</div>
                        <AutocompleteController
                            control={control}
                            fieldName="type"
                            label="Type"
                            loading={isLoading}
                            options={VehicleTypeList}
                            placeholder="Select Type"
                            required
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                control={control}
                                fieldName="brand"
                                label="Brand"
                                loading={isLoading}
                                placeholder="Toyota, Nissan, Honda, etc"
                            />
                            <InputController
                                control={control}
                                fieldName="model"
                                label="Model"
                                loading={isLoading}
                                placeholder="Civic, Sunny, Swift, etc"
                            />
                            <InputController
                                control={control}
                                fieldName="trim"
                                label="Trim"
                                loading={isLoading}
                                placeholder="LX, EX, EX-L, Sport, etc"
                            />
                            <AutocompleteController
                                control={control}
                                fieldName="condition"
                                label="Condition"
                                loading={isLoading}
                                options={VehicleConditionList}
                                placeholder="Select Condition"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Manufactured Year</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <YearInputController
                                control={control}
                                fieldName="minYearOfManufacture"
                                gridCols="grid-cols-3"
                                label="Manufactured after"
                                loading={isLoading}
                                placeholder="1990"
                            />
                            <YearInputController
                                control={control}
                                fieldName="maxYearOfManufacture"
                                gridCols="grid-cols-3"
                                label="Manufactured before"
                                loading={isLoading}
                                placeholder="2000"
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Registered Year</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <YearInputController
                                control={control}
                                fieldName="minYearOfRegistration"
                                gridCols="grid-cols-3"
                                label="Registered after"
                                loading={isLoading}
                                placeholder="2010"
                            />
                            <YearInputController
                                control={control}
                                fieldName="maxYearOfRegistration"
                                gridCols="grid-cols-3"
                                label="Registered before"
                                loading={isLoading}
                                placeholder="2020"
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Price Range</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <NumberInputController
                                control={control}
                                fieldName="minPrice.amount"
                                inputPrefix="Rs."
                                label="Minimum Price"
                                loading={isLoading}
                                placeholder="1,000,000"
                            />
                            <NumberInputController
                                control={control}
                                fieldName="maxPrice.amount"
                                inputPrefix="Rs."
                                label="Maximum Price"
                                loading={isLoading}
                                placeholder="10,000,000"
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Mileage</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <NumberInputController
                                control={control}
                                fieldName="minMillage"
                                inputSuffix="KM"
                                label="Minimum Mileage"
                                loading={isLoading}
                                placeholder="10,000"
                            />
                            <NumberInputController
                                control={control}
                                fieldName="maxMillage"
                                inputSuffix="KM"
                                label="Maximum Mileage"
                                loading={isLoading}
                                placeholder="1,000,000"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex justify-end">
                <button
                    className="btn btn-neutral btn-wide"
                    disabled={isMutating || isLoading || (submitButton.disableIfCleanForm && !isDirty)}
                    type="submit"
                >
                    {isMutating ? submitButton.mutatingText ?? "Loading..." : submitButton.text ?? "Submit"}
                </button>
            </div>
        </form>
    );
};
