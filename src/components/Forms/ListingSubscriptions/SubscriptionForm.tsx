"use client";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { DatePickerController } from "@/components/FormElements/DatePicker";
import { InputController } from "@/components/FormElements/Input";
import { Dates, SubscriptFrequenciesList, VehicleConditionList, VehicleTypeList, YearSelectMinYear } from "@/utils/constants";
import { CreateSubscriptionReq } from "@/utils/types";

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
    const { handleSubmit, formState: { isDirty } = {}, control } = form as UseFormReturn<CreateSubscriptionReq>;

    return (
        <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
            <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="stat card bg-base-100 p-4 shadow">
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
                    <div className="stat card bg-base-100 p-4 shadow">
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
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Manufactured Year</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                control={control}
                                fieldName="minYearOfManufacture"
                                label="Manufactured after"
                                loading={isLoading}
                                max={new Date().getFullYear()}
                                min={YearSelectMinYear}
                                placeholder="1990"
                                type="number"
                            />
                            <InputController
                                control={control}
                                fieldName="maxYearOfManufacture"
                                label="Manufactured before"
                                loading={isLoading}
                                max={new Date().getFullYear()}
                                min={YearSelectMinYear}
                                placeholder="2000"
                                type="number"
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Registered Year</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                control={control}
                                fieldName="minYearOfRegistration"
                                label="Registered after"
                                loading={isLoading}
                                max={new Date().getFullYear()}
                                min={YearSelectMinYear}
                                placeholder="2010"
                                type="number"
                            />
                            <InputController
                                control={control}
                                fieldName="maxYearOfRegistration"
                                label="Registered before"
                                loading={isLoading}
                                max={new Date().getFullYear()}
                                min={YearSelectMinYear}
                                placeholder="2020"
                                type="number"
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Price Range</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                control={control}
                                fieldName="minPrice.amount"
                                label="Minimum Price"
                                loading={isLoading}
                                placeholder="1000000"
                                type="number"
                            />
                            <InputController
                                control={control}
                                fieldName="maxPrice.amount"
                                label="Maximum Price"
                                loading={isLoading}
                                placeholder="1000000"
                                type="number"
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Milage</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                control={control}
                                fieldName="minMillage"
                                label="Minimum milage"
                                loading={isLoading}
                                placeholder="10000"
                                type="number"
                            />
                            <InputController
                                control={control}
                                fieldName="maxMillage"
                                label="Maximum milage"
                                loading={isLoading}
                                placeholder="1000000"
                                type="number"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex justify-end">
                <button
                    className="btn-neutral btn-wide btn"
                    disabled={isMutating || isLoading || (submitButton.disableIfCleanForm && !isDirty)}
                    type="submit"
                >
                    {isMutating ? submitButton.mutatingText ?? "Loading..." : submitButton.text ?? "Submit"}
                </button>
            </div>
        </form>
    );
};
