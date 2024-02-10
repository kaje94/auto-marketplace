/* eslint-disable max-lines */
"use client";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import React, { FC, ReactNode, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { LinkWithLocale } from "@/components/Common";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { CheckboxController } from "@/components/FormElements/Checkbox";
import { InputController } from "@/components/FormElements/Input";
import { NumberInputController } from "@/components/FormElements/NumberInput";
import { SelectController } from "@/components/FormElements/Select";
import { TagSelectController } from "@/components/FormElements/TagSelect";
import { TextAreaController } from "@/components/FormElements/TextArea";
import { YearInputController } from "@/components/FormElements/YearInput";
import { AlertCircleIcon } from "@/icons";
import { FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList } from "@/utils/constants";
import { COUNTRIES } from "@/utils/countries";
import { getDistanceUnit, getRandomItem, isIncompleteUserProfile } from "@/utils/helpers";
import { CreateListingReq, ListingUser, VehicleBrand, VehicleFeature } from "@/utils/types";
import { ListingImageUploadLoading } from "./ListingImageUpload";

const ProfileUpdateModal = dynamic(() => import("@/components/Modals/ProfileUpdateModal").then((mod) => mod.ProfileUpdateModal), { ssr: false });

const ListingImageUpload = dynamic(() => import("./ListingImageUpload").then((mod) => mod.ListingImageUpload), {
    loading: () => <ListingImageUploadLoading />,
    ssr: false,
});

interface Props {
    featureOptions?: VehicleFeature[];
    form?: UseFormReturn<CreateListingReq>;
    isLoading?: boolean;
    isMutating?: boolean;
    isUpdateProfileEnabled?: boolean;
    onMutate?: (values: CreateListingReq) => void;
    profile?: ListingUser;
    submitButton?: {
        disableIfCleanForm?: boolean;
        mutatingText?: string;
        text?: string;
    };
    title?: string;
    vehicleBrands?: VehicleBrand[];
}

const DetailsItem = ({ title, value, loading }: { loading?: boolean; title: string; value: ReactNode }) => (
    <div>
        <div className="text-sm font-light opacity-70">{title}</div>

        {loading ? (
            <div className={clsx("my-0.5 h-5 animate-pulse bg-base-200", getRandomItem(["w-32", "w-40", "w-28", "w-48"]))} />
        ) : (
            <div className="mb-2">{value}</div>
        )}
    </div>
);

/** Form used to create or edit listing adverts */
export const ListingForm: FC<Props> = (props) => {
    const {
        featureOptions = [],
        isMutating,
        isLoading,
        form = {},
        onMutate = () => {},
        submitButton = {},
        title,
        vehicleBrands = [],
        profile,
        isUpdateProfileEnabled = true,
    } = props;

    const { handleSubmit, formState: { isDirty } = {}, control, watch = (_: string) => "", setValue } = form as UseFormReturn<CreateListingReq>;
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const country = watch("location.country");
    const state = watch("location.state");
    const city = watch("location.city");
    const postalCode = watch("location.postalCode");
    const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === country);
    const distanceUnit = getDistanceUnit(countryCode);
    const countryItem = COUNTRIES[countryCode || ""];
    const currencySymbol = countryItem?.[2];
    const phoneCode = countryItem?.[3];

    const [optimisticProfile, addOptimisticProfile] = React.useOptimistic(profile, (state, newState: Partial<ListingUser>) =>
        state ? { ...state, ...newState } : undefined,
    );

    const isProfileIncomplete = optimisticProfile ? isIncompleteUserProfile(optimisticProfile) : false;

    const onProfileUpdate = (data: Partial<ListingUser>) => {
        setProfileModalVisible(false);
        addOptimisticProfile(data);
        if (setValue) {
            setValue("location.city", data.address?.city!);
            setValue("location.state", data.address?.state!);
            setValue("location.postalCode", data.address?.postalCode!);
            setValue("location.country", data.address?.country!);
        }
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
                            <div className="stat-title">Key Specifications</div>
                            <SelectController
                                control={control}
                                disabled={isProfileIncomplete}
                                fieldName="vehicle.type"
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
                                    fieldName="vehicle.brand"
                                    label="Brand"
                                    loading={isLoading}
                                    options={vehicleBrands.map((item) => ({ label: item.name, value: item.name }))}
                                    placeholder="Toyota, Nissan, Honda, etc"
                                    required
                                />
                                <InputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.model"
                                    label="Model"
                                    loading={isLoading}
                                    placeholder="Civic, Sunny, Swift, etc"
                                    required
                                />
                                <InputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.trim"
                                    label="Trim"
                                    loading={isLoading}
                                    placeholder="LX, EX, EX-L, Sport, etc"
                                />
                                <YearInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.yearOfManufacture"
                                    label="Year of Manufacture"
                                    loading={isLoading}
                                    placeholder="2000"
                                    required
                                />
                                <YearInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.yearOfRegistration"
                                    label="Year of Registration"
                                    loading={isLoading}
                                    placeholder="2010"
                                />
                                <NumberInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.millage.distance"
                                    inputSuffix={distanceUnit}
                                    label="Mileage"
                                    loading={isLoading}
                                    placeholder="50,000"
                                    required
                                />
                                <SelectController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.condition"
                                    label="Condition"
                                    loading={isLoading}
                                    options={VehicleConditionList}
                                    placeholder="Select Condition"
                                    required
                                    selectablePlaceholder
                                />
                                <SelectController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.transmission"
                                    label="Transmission Type"
                                    loading={isLoading}
                                    options={TransmissionTypeList}
                                    placeholder="Select Type"
                                    required
                                    selectablePlaceholder
                                />
                                <SelectController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.fuelType"
                                    label="Fuel Type"
                                    loading={isLoading}
                                    options={FuelTypeList}
                                    placeholder="Select Fuel Type"
                                    required
                                    selectablePlaceholder
                                />
                                <NumberInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.engineCapacity"
                                    inputSuffix="CC"
                                    label="Engine Capacity"
                                    loading={isLoading}
                                    placeholder="1,500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">Other details</div>
                            <TextAreaController
                                control={control}
                                disabled={isProfileIncomplete}
                                fieldName="description"
                                label="Description"
                                loading={isLoading}
                                placeholder="Description of the vehicle for sale"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">
                                Images <span className="text-error">*</span>
                            </div>
                            {isLoading ? (
                                <ListingImageUploadLoading />
                            ) : (
                                <Controller
                                    control={control}
                                    name="vehicle.vehicleImages"
                                    render={({ field, fieldState }) => (
                                        <ListingImageUpload
                                            disabled={isProfileIncomplete}
                                            error={fieldState.error?.message}
                                            files={field.value}
                                            ref={field.ref}
                                            setFiles={(images) => field.onChange(images)}
                                            title={title || "New Advert Image"}
                                        />
                                    )}
                                />
                            )}
                        </div>
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="flex items-center justify-between">
                                <div className="stat-title">Location & Contact Details</div>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    disabled={!optimisticProfile || isLoading || !isUpdateProfileEnabled}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setProfileModalVisible(true);
                                    }}
                                >
                                    Update
                                </button>
                            </div>
                            <div className="grid gap-1 pt-2 sm:grid-cols-2">
                                <DetailsItem title="Country" value={(country as string) || "-"} />
                                <DetailsItem title="State/Province" value={(state as string) || "-"} />
                                <DetailsItem title="City" value={(city as string) || "-"} />
                                <DetailsItem title="Postal Code" value={(postalCode as string) || "-"} />
                                <div className="divider col-span-full -mt-2 mb-0 opacity-50" />
                                <DetailsItem title="Email" value={optimisticProfile?.email || "-"} />
                                <DetailsItem
                                    title="Phone Number"
                                    value={
                                        <>
                                            <span className="font-light opacity-70">{phoneCode ? `(${phoneCode}) ` : ""}</span>
                                            {optimisticProfile?.phone ?? "-"}
                                        </>
                                    }
                                />
                            </div>
                        </div>

                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">Price Details</div>
                            <NumberInputController
                                control={control}
                                disabled={isProfileIncomplete}
                                fieldName="price.amount"
                                inputPrefix={currencySymbol}
                                label="Price"
                                loading={isLoading}
                                placeholder="40,000,000"
                                required
                            />
                            <CheckboxController
                                control={control}
                                disabled={isProfileIncomplete}
                                fieldName="price.isPriceNegotiable"
                                label="Is the price negotiable?"
                                loading={isLoading}
                            />
                        </div>
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">Features</div>
                            <span className="mt-2">
                                <TagSelectController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.featureIds"
                                    loading={isLoading}
                                    loadingPlaceholderCount={20}
                                    tags={featureOptions}
                                />
                            </span>
                        </div>
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">Safety Tips</div>
                            {isLoading ? (
                                <>
                                    <div className="h-16 w-full animate-pulse bg-base-200" />
                                    <div className="mt-1 h-7 w-1/3 animate-pulse bg-base-200" />
                                </>
                            ) : (
                                <>
                                    <p className="mt-1 text-sm">
                                        Please prioritize safety. Avoid sharing sensitive information. A secure marketplace benefits us all.
                                    </p>
                                    <LinkWithLocale
                                        className="link-neutral btn btn-link btn-sm justify-start px-0"
                                        href="/safety-tips"
                                        target="_blank"
                                    >
                                        View all safety Tips
                                    </LinkWithLocale>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex justify-end">
                    <button
                        className="btn btn-neutral btn-wide"
                        data-testid="listing-form-submit-btn"
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
