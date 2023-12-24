"use client";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { DatePickerController } from "@/components/FormElements/DatePicker";
import { InputController } from "@/components/FormElements/Input";
import { NumberInputController } from "@/components/FormElements/NumberInput";
import { SelectController } from "@/components/FormElements/Select";
import { YearInputController } from "@/components/FormElements/YearInput";
import { Dates, SubscriptFrequenciesList, VehicleConditionList, VehicleTypeList } from "@/utils/constants";
import { CreateSubscriptionReq, VehicleBrand } from "@/utils/types";

interface Props {
    countryCurrencySymbol?: string;
    distanceUnit?: string;
    form?: UseFormReturn<CreateSubscriptionReq>;
    isLoading?: boolean;
    isMutating?: boolean;
    onMutate?: (values: CreateSubscriptionReq) => void;
    submitButton?: {
        disableIfCleanForm?: boolean;
        mutatingText?: string;
        text?: string;
    };
    vehicleBrands?: VehicleBrand[];
}

export const SubscriptionForm: FC<Props> = (props) => {
    const {
        isMutating,
        isLoading,
        form = {},
        onMutate = () => {},
        submitButton = {},
        countryCurrencySymbol,
        distanceUnit,
        vehicleBrands = [],
    } = props;
    const { handleSubmit, formState: { isDirty } = {}, control, watch = (_: string) => "" } = form as UseFormReturn<CreateSubscriptionReq>;
    const maxYearOfManufacture = watch("maxYearOfManufacture");
    const minYearOfManufacture = watch("minYearOfManufacture");
    const minYearOfRegistration = watch("minYearOfRegistration");
    const maxYearOfRegistration = watch("maxYearOfRegistration");

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
                            required
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <SelectController
                                control={control}
                                fieldName="notificationFrequency"
                                label="Subscription Frequency"
                                loading={isLoading}
                                options={SubscriptFrequenciesList}
                                placeholder="Select Frequency"
                                required
                                selectablePlaceholder
                            />
                            <DatePickerController
                                control={control}
                                fieldName="subscriptionExpiryDate"
                                label="Subscription expiry date"
                                loading={isLoading}
                                minDate={Dates.Days_8_from_now}
                                placeholderText={new Date(Dates.Days_8_from_now).toLocaleDateString("en-US")}
                                required
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Key Specifications</div>
                        <SelectController
                            control={control}
                            fieldName="type"
                            label="Type"
                            loading={isLoading}
                            options={VehicleTypeList}
                            placeholder="Select Type"
                            required
                            selectablePlaceholder
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <AutocompleteController
                                control={control}
                                fieldName="brand"
                                label="Brand"
                                loading={isLoading}
                                options={vehicleBrands.map((item) => ({ label: item.name, value: item.name }))}
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
                            <SelectController
                                control={control}
                                fieldName="condition"
                                label="Condition"
                                loading={isLoading}
                                options={VehicleConditionList}
                                placeholder="Select Condition"
                                selectablePlaceholder
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
                                label="Manufactured after"
                                loading={isLoading}
                                maxYear={maxYearOfManufacture ? Number(maxYearOfManufacture) : undefined}
                                placeholder="1990"
                            />
                            <YearInputController
                                control={control}
                                fieldName="maxYearOfManufacture"
                                label="Manufactured before"
                                loading={isLoading}
                                minYear={minYearOfManufacture ? Number(minYearOfManufacture) : undefined}
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
                                label="Registered after"
                                loading={isLoading}
                                maxYear={maxYearOfRegistration ? Number(maxYearOfRegistration) : undefined}
                                placeholder="2010"
                            />
                            <YearInputController
                                control={control}
                                fieldName="maxYearOfRegistration"
                                label="Registered before"
                                loading={isLoading}
                                minYear={minYearOfRegistration ? Number(minYearOfRegistration) : undefined}
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
                                inputPrefix={countryCurrencySymbol}
                                label="Minimum Price"
                                loading={isLoading}
                                placeholder="1,000,000"
                            />
                            <NumberInputController
                                control={control}
                                fieldName="maxPrice.amount"
                                inputPrefix={countryCurrencySymbol}
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
                                fieldName="minMillage.distance"
                                inputSuffix={distanceUnit}
                                label="Minimum Mileage"
                                loading={isLoading}
                                placeholder="10,000"
                            />
                            <NumberInputController
                                control={control}
                                fieldName="maxMillage.distance"
                                inputSuffix={distanceUnit}
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
