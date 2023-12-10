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
import { useScopedI18n } from "@/locales/client";
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

    const tListingForm = useScopedI18n("components.forms.listing.form");
    const tCommon = useScopedI18n("common");
    const tForm = useScopedI18n("form");

    return (
        <>
            {!isLoading && isProfileIncomplete && (
                <div className="alert alert-warning mb-6 mt-4 shadow-lg md:mt-1">
                    <AlertCircleIcon />
                    <div>
                        <h3 className="font-bold">{tListingForm("incompleteProfileTitle")}</h3>
                        <div className="text-xs">{tListingForm("incompleteProfileDesc")}</div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setProfileModalVisible(true)}>
                        {tCommon("updateProfile")}
                    </button>
                </div>
            )}
            <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
                <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                    <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">{tListingForm("sections.keySpecifications")}</div>
                            <SelectController
                                control={control}
                                disabled={isProfileIncomplete}
                                fieldName="vehicle.type"
                                label={tForm("vehicleType.label")}
                                loading={isLoading}
                                options={VehicleTypeList}
                                placeholder={tForm("vehicleType.placeholder")}
                                required
                                selectablePlaceholder
                            />
                            <div className="grid gap-1 sm:grid-cols-2">
                                <AutocompleteController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.brand"
                                    label={tForm("brand.label")}
                                    loading={isLoading}
                                    options={vehicleBrands.map((item) => ({ label: item.name, value: item.name }))}
                                    placeholder={tForm("brand.placeholder")}
                                    required
                                />
                                <InputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.model"
                                    label={tForm("model.label")}
                                    loading={isLoading}
                                    placeholder={tForm("model.placeholder")}
                                    required
                                />
                                <InputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.trim"
                                    label={tForm("trim.label")}
                                    loading={isLoading}
                                    placeholder={tForm("trim.placeholder")}
                                />
                                <YearInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.yearOfManufacture"
                                    label={tForm("yom.label")}
                                    loading={isLoading}
                                    placeholder={tForm("yom.placeholder")}
                                    required
                                />
                                <YearInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.yearOfRegistration"
                                    label={tForm("yearOfRegistration.label")}
                                    loading={isLoading}
                                    placeholder={tForm("yearOfRegistration.placeholder")}
                                />
                                <NumberInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.millage.distance"
                                    inputSuffix={distanceUnit}
                                    label={tForm("mileage.label")}
                                    loading={isLoading}
                                    placeholder={tForm("mileage.placeholder")}
                                    required
                                />
                                <SelectController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.condition"
                                    label={tForm("condition.label")}
                                    loading={isLoading}
                                    options={VehicleConditionList}
                                    placeholder={tForm("condition.placeholder")}
                                    required
                                    selectablePlaceholder
                                />
                                <SelectController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.transmission"
                                    label={tForm("transmissionType.label")}
                                    loading={isLoading}
                                    options={TransmissionTypeList}
                                    placeholder={tForm("transmissionType.placeholder")}
                                    required
                                    selectablePlaceholder
                                />
                                <SelectController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.fuelType"
                                    label={tForm("fuelType.label")}
                                    loading={isLoading}
                                    options={FuelTypeList}
                                    placeholder={tForm("fuelType.placeholder")}
                                    required
                                    selectablePlaceholder
                                />
                                <NumberInputController
                                    control={control}
                                    disabled={isProfileIncomplete}
                                    fieldName="vehicle.engineCapacity"
                                    inputSuffix="CC"
                                    label={tForm("engineCapacity.label")}
                                    loading={isLoading}
                                    placeholder={tForm("engineCapacity.placeholder")}
                                    required
                                />
                            </div>
                        </div>
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">{tListingForm("sections.otherDetails")}</div>
                            <TextAreaController
                                control={control}
                                disabled={isProfileIncomplete}
                                fieldName="description"
                                label={tForm("listingDescription.label")}
                                loading={isLoading}
                                placeholder={tForm("listingDescription.placeholder")}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">
                                {tListingForm("sections.images")} <span className="text-error">*</span>
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
                                            title={title || tListingForm("sections.imageSectionTitle")}
                                        />
                                    )}
                                />
                            )}
                        </div>
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="flex items-center justify-between">
                                <div className="stat-title">{tListingForm("sections.locationAndContact")}</div>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    disabled={!optimisticProfile || isLoading || !isUpdateProfileEnabled}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setProfileModalVisible(true);
                                    }}
                                >
                                    {tCommon("update")}
                                </button>
                            </div>
                            <div className="grid gap-1 pt-2 sm:grid-cols-2">
                                <DetailsItem title={tForm("country.label")} value={(country as string) || "-"} />
                                <DetailsItem title={tForm("state.label")} value={(state as string) || "-"} />
                                <DetailsItem title={tForm("city.label")} value={(city as string) || "-"} />
                                <DetailsItem title={tForm("postalCode.label")} value={(postalCode as string) || "-"} />
                                <div className="divider col-span-full -mt-2 mb-0 opacity-50" />
                                <DetailsItem title={tForm("email.label")} value={optimisticProfile?.email || "-"} />
                                <DetailsItem
                                    title={tForm("phoneNumber.label")}
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
                            <div className="stat-title">{tListingForm("sections.price")}</div>
                            <NumberInputController
                                control={control}
                                disabled={isProfileIncomplete}
                                fieldName="price.amount"
                                inputPrefix={currencySymbol}
                                label={tForm("price.label")}
                                loading={isLoading}
                                placeholder={tForm("price.placeholder")}
                                required
                            />
                            <CheckboxController
                                control={control}
                                disabled={isProfileIncomplete}
                                fieldName="price.isPriceNegotiable"
                                label={tForm("priceNegotiable.label")}
                                loading={isLoading}
                            />
                        </div>
                        <div className="card stat bg-base-100 p-4 shadow">
                            <div className="stat-title">{tListingForm("sections.features")}</div>
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
                            <div className="stat-title">{tListingForm("sections.safetyTips.title")}</div>
                            {isLoading ? (
                                <>
                                    <div className="h-16 w-full animate-pulse bg-base-200" />
                                    <div className="mt-1 h-7 w-1/3 animate-pulse bg-base-200" />
                                </>
                            ) : (
                                <>
                                    <p className="mt-1 text-sm">{tListingForm("sections.safetyTips.desc")}</p>
                                    <LinkWithLocale
                                        className="link-neutral btn btn-link btn-sm justify-start px-0"
                                        href="/safety-tips"
                                        target="_blank"
                                    >
                                        {tListingForm("sections.safetyTips.viewAllLink")}
                                    </LinkWithLocale>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex justify-end">
                    <button
                        className="btn btn-neutral btn-wide"
                        disabled={isMutating || isLoading || (submitButton.disableIfCleanForm && !isDirty)}
                        type="submit"
                    >
                        {isMutating ? submitButton.mutatingText ?? tCommon("loading") : submitButton.text ?? tForm("buttons.submit.label")}
                    </button>
                </div>
            </form>
            {optimisticProfile && (
                <ProfileUpdateModal
                    setVisible={setProfileModalVisible}
                    userData={optimisticProfile}
                    visible={profileModalVisible}
                    onSuccess={onProfileUpdate}
                />
            )}
        </>
    );
};
