"use client";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { InputController } from "@/components/FormElements/Input";
import { NumberInputController } from "@/components/FormElements/NumberInput";
import { SelectController } from "@/components/FormElements/Select";
import { YearInputController } from "@/components/FormElements/YearInput";
import { useScopedI18n } from "@/locales/client";
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

    const tSubscriptionForm = useScopedI18n("components.forms.subscriptions.form");
    const tForm = useScopedI18n("form");

    return (
        <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
            <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">{tSubscriptionForm("configurationsText")}</div>
                        <InputController
                            control={control}
                            fieldName="displayName"
                            label={tForm("subscriptionDisplayName.label")}
                            loading={isLoading}
                            placeholder={tForm("subscriptionDisplayName.placeholder")}
                            required
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <SelectController
                                control={control}
                                fieldName="notificationFrequency"
                                label={tForm("subscriptionFrequency.label")}
                                loading={isLoading}
                                options={SubscriptFrequenciesList}
                                placeholder={tForm("subscriptionFrequency.placeholder")}
                                required
                                selectablePlaceholder
                            />
                            <InputController
                                control={control}
                                fieldName="subscriptionExpiryDate"
                                label={tForm("subscriptionExpiry.label")}
                                loading={isLoading}
                                min={Dates.Days_7_from_now.toISOString().split("T")[0]}
                                placeholder={tForm("subscriptionExpiry.placeholder")}
                                type="date"
                                required
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">{tSubscriptionForm("keySpecificationsText")}</div>
                        <SelectController
                            control={control}
                            fieldName="type"
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
                                fieldName="brand"
                                label={tForm("brand.label")}
                                loading={isLoading}
                                options={vehicleBrands.map((item) => ({ label: item.name, value: item.name }))}
                                placeholder={tForm("brand.placeholder")}
                            />
                            <InputController
                                control={control}
                                fieldName="model"
                                label={tForm("model.label")}
                                loading={isLoading}
                                placeholder={tForm("model.placeholder")}
                            />
                            <InputController
                                control={control}
                                fieldName="trim"
                                label={tForm("trim.label")}
                                loading={isLoading}
                                placeholder={tForm("transmissionType.placeholder")}
                            />
                            <SelectController
                                control={control}
                                fieldName="condition"
                                label={tForm("condition.label")}
                                loading={isLoading}
                                options={VehicleConditionList}
                                placeholder={tForm("condition.placeholder")}
                                selectablePlaceholder
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">{tSubscriptionForm("manufacturedYearText")}</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <YearInputController
                                control={control}
                                fieldName="minYearOfManufacture"
                                label={tForm("yomStartDate.label")}
                                loading={isLoading}
                                maxYear={maxYearOfManufacture ? Number(maxYearOfManufacture) : undefined}
                                placeholder={tForm("yomStartDate.placeholderYear")}
                            />
                            <YearInputController
                                control={control}
                                fieldName="maxYearOfManufacture"
                                label={tForm("yomEndDate.label")}
                                loading={isLoading}
                                minYear={minYearOfManufacture ? Number(minYearOfManufacture) : undefined}
                                placeholder={tForm("yomEndDate.placeholderYear")}
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Registered Year</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <YearInputController
                                control={control}
                                fieldName="minYearOfRegistration"
                                label={tForm("yearOfRegistrationStart.label")}
                                loading={isLoading}
                                maxYear={maxYearOfRegistration ? Number(maxYearOfRegistration) : undefined}
                                placeholder={tForm("yearOfRegistrationStart.placeholderYear")}
                            />
                            <YearInputController
                                control={control}
                                fieldName="maxYearOfRegistration"
                                label={tForm("yearOfRegistrationEnd.label")}
                                loading={isLoading}
                                minYear={minYearOfRegistration ? Number(minYearOfRegistration) : undefined}
                                placeholder={tForm("yearOfRegistrationEnd.placeholder")}
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">{tSubscriptionForm("priceRangeText")}</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <NumberInputController
                                control={control}
                                fieldName="minPrice.amount"
                                inputPrefix={countryCurrencySymbol}
                                label={tForm("minPrice.label")}
                                loading={isLoading}
                                placeholder={tForm("minPrice.placeholderNum")}
                            />
                            <NumberInputController
                                control={control}
                                fieldName="maxPrice.amount"
                                inputPrefix={countryCurrencySymbol}
                                label={tForm("maxPrice.label")}
                                loading={isLoading}
                                placeholder={tForm("maxPrice.placeholderNum")}
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">{tSubscriptionForm("mileageRangeText")}</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <NumberInputController
                                control={control}
                                fieldName="minMillage.distance"
                                inputSuffix={distanceUnit}
                                label={tForm("mileageMin.label")}
                                loading={isLoading}
                                placeholder={tForm("mileageMin.placeholderNum")}
                            />
                            <NumberInputController
                                control={control}
                                fieldName="maxMillage.distance"
                                inputSuffix={distanceUnit}
                                label={tForm("mileageMax.label")}
                                loading={isLoading}
                                placeholder={tForm("mileageMax.placeholder")}
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
                    {isMutating ? submitButton.mutatingText ?? tForm("buttons.submit.loading") : submitButton.text ?? tForm("subject.label")}
                </button>
            </div>
        </form>
    );
};
