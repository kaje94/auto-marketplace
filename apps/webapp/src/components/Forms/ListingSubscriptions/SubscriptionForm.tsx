"use client";
import { PartialMessage } from "@bufbuild/protobuf";
import React, { FC, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { DatePickerController } from "@/components/FormElements/DatePicker";
import { InputController } from "@/components/FormElements/Input";
import { NumberInputController } from "@/components/FormElements/NumberInput";
import { SelectController } from "@/components/FormElements/Select";
import { YearInputController } from "@/components/FormElements/YearInput";
import { ProfileUpdateModal } from "@/components/Modals/ProfileUpdateModal";
import { AlertCircleIcon } from "@/icons";
import { VEHICLE_BRANDS } from "@/utils/brands";
import { Dates, SubscriptFrequenciesList, VehicleConditionList, VehicleTypeList } from "@/utils/constants";
import { isIncompleteUserProfile } from "@/utils/helpers";
import { CreateSubscriptionReq } from "@/utils/types";

interface Props {
    countryCurrencySymbol?: string;
    distanceUnit?: string;
    form?: UseFormReturn<CreateSubscriptionReq>;
    isLoading?: boolean;
    isMutating?: boolean;
    onMutate?: (values: CreateSubscriptionReq) => void;
    profile?: PartialMessage<UserProfile>;
    submitButton?: {
        disableIfCleanForm?: boolean;
        mutatingText?: string;
        text?: string;
    };
}

export const SubscriptionForm: FC<Props> = (props) => {
    const { isMutating, isLoading, form = {}, onMutate = () => {}, submitButton = {}, countryCurrencySymbol, distanceUnit, profile } = props;
    const { handleSubmit, formState: { isDirty } = {}, control, watch = (_: string) => "" } = form as UseFormReturn<CreateSubscriptionReq>;
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const maxYearOfManufacture = watch("maxYearOfManufacture");
    const minYearOfManufacture = watch("minYearOfManufacture");
    const minYearOfRegistration = watch("minYearOfRegistration");
    const maxYearOfRegistration = watch("maxYearOfRegistration");

    const [optimisticProfile, addOptimisticProfile] = React.useOptimistic(profile, (state, newState: PartialMessage<UserProfile>) =>
        state ? { ...state, ...newState } : undefined,
    );

    const isProfileIncomplete = optimisticProfile ? isIncompleteUserProfile(optimisticProfile) : false;

    const onProfileUpdate = (data: PartialMessage<UserProfile>) => {
        setProfileModalVisible(false);
        addOptimisticProfile(data);
    };

    return (
        <>
            {!isLoading && isProfileIncomplete && (
                <div className="alert alert-warning mb-6 mt-4 shadow-lg md:mt-1">
                    <AlertCircleIcon />
                    <div>
                        <h3 className="font-bold">Incomplete Profile</h3>
                        <div className="text-xs">Please update your profile to create an advertisement for your vehicle</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setProfileModalVisible(true)}>
                        Update Profile
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
                <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                    <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">Subscription Configurations</div>
                            <InputController
                                control={control}
                                disabled={isProfileIncomplete}
                                fieldName="displayName"
                                label="Display Name"
                                loading={isLoading}
                                placeholder="Name of the subscription"
                                required
                            />
                            <div className="grid gap-1 sm:grid-cols-2">
                                <SelectController
                                    control={control}
                                    disabled={isProfileIncomplete}
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
                                    disabled={isProfileIncomplete}
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
                                disabled={isProfileIncomplete}
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
                                    disabled={isProfileIncomplete}
                                    fieldName="brand"
                                    label="Brand"
                                    loading={isLoading}
                                    options={VEHICLE_BRANDS.map((item) => ({ label: item, value: item }))}
                                    placeholder="Toyota, Nissan, Honda, etc"
                                />
                                <InputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="model"
                                    label="Model"
                                    loading={isLoading}
                                    placeholder="Civic, Sunny, Swift, etc"
                                />
                                <InputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="trim"
                                    label="Trim"
                                    loading={isLoading}
                                    placeholder="LX, EX, EX-L, Sport, etc"
                                />
                                <SelectController
                                    control={control}
                                    disabled={isProfileIncomplete}
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
                                    disabled={isProfileIncomplete}
                                    fieldName="minYearOfManufacture"
                                    label="Manufactured after"
                                    loading={isLoading}
                                    maxYear={maxYearOfManufacture ? Number(maxYearOfManufacture) : undefined}
                                    placeholder="1990"
                                />
                                <YearInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
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
                                    disabled={isProfileIncomplete}
                                    fieldName="minYearOfRegistration"
                                    label="Registered after"
                                    loading={isLoading}
                                    maxYear={maxYearOfRegistration ? Number(maxYearOfRegistration) : undefined}
                                    placeholder="2010"
                                />
                                <YearInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
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
                                    disabled={isProfileIncomplete}
                                    fieldName="minPrice.amount"
                                    inputPrefix={countryCurrencySymbol}
                                    label="Minimum Price"
                                    loading={isLoading}
                                    placeholder="1,000,000"
                                />
                                <NumberInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
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
                                    disabled={isProfileIncomplete}
                                    fieldName="minMillage.distance"
                                    inputSuffix={distanceUnit}
                                    label="Minimum Mileage"
                                    loading={isLoading}
                                    placeholder="10,000"
                                />
                                <NumberInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
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
            {optimisticProfile && (
                <ProfileUpdateModal
                    userData={optimisticProfile}
                    visible={profileModalVisible}
                    onSuccess={onProfileUpdate}
                    onVisibleChange={setProfileModalVisible}
                />
            )}
        </>
    );
};