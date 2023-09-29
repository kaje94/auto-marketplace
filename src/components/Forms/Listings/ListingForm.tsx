"use client";
import { CreateListingReq, VehicleFeature } from "@/utils/types";
import { FC } from "react";
import { FieldError, Controller, UseFormReturn } from "react-hook-form";
import { FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList, YearRangeList } from "@/utils/constants";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { ListingImageUpload } from "./ListingImageUpload";
import { InputController } from "@/components/FormElements/Input";
import { TagSelectController } from "@/components/FormElements/TagSelect";
import { TextAreaController } from "@/components/FormElements/TextArea";
import { CheckboxController } from "@/components/FormElements/Checkbox";
import { SelectController } from "@/components/FormElements/Select";

interface Props {
    featureOptions?: VehicleFeature[];
    submitButton?: {
        text?: string;
        mutatingText?: string;
        disableIfCleanForm?: boolean;
    };
    isLoading?: boolean;
    isMutating?: boolean;
    form?: UseFormReturn<CreateListingReq>;
    onMutate?: (values: CreateListingReq) => void;
    title?: string;
}

export const ListingForm: FC<Props> = (props) => {
    const { featureOptions = [], isMutating, isLoading, form = {}, onMutate = () => {}, submitButton = {}, title } = props;
    const { handleSubmit, formState: { errors, isDirty } = {}, register = () => {}, control } = form as UseFormReturn<CreateListingReq>;

    return (
        <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
            <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Key Specifications</div>
                        <AutocompleteController
                            fieldName="vehicle.type"
                            label="Type"
                            placeholder="Select Type"
                            loading={isLoading}
                            required
                            options={VehicleTypeList}
                            control={control}
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                fieldName="vehicle.brand"
                                placeholder="Toyota, Nissan, Honda, etc"
                                label="Brand"
                                loading={isLoading}
                                required
                                control={control}
                            />
                            <InputController
                                fieldName="vehicle.model"
                                placeholder="Civic, Sunny, Swift, etc"
                                label="Model"
                                loading={isLoading}
                                required
                                control={control}
                            />
                            <InputController
                                fieldName="vehicle.trim"
                                placeholder="LX, EX, EX-L, Sport, etc"
                                loading={isLoading}
                                label="Trim"
                                control={control}
                            />
                            <AutocompleteController
                                fieldName="vehicle.yearOfManufacture"
                                label="Year of Manufacture"
                                placeholder="2000"
                                loading={isLoading}
                                required
                                options={YearRangeList}
                                gridCols="grid-cols-3"
                                showSelectedTick={false}
                                control={control}
                            />
                            <AutocompleteController
                                fieldName="vehicle.yearOfRegistration"
                                label="Year of Registration"
                                placeholder="2010"
                                loading={isLoading}
                                required
                                options={YearRangeList}
                                gridCols="grid-cols-3"
                                showSelectedTick={false}
                                control={control}
                            />
                            <InputController
                                fieldName="vehicle.millage"
                                placeholder="50000"
                                label="Milage"
                                type="number"
                                loading={isLoading}
                                required
                                control={control}
                            />
                            <AutocompleteController
                                fieldName="vehicle.condition"
                                label="Condition"
                                placeholder="Select Condition"
                                loading={isLoading}
                                required
                                options={VehicleConditionList}
                                control={control}
                            />
                            <AutocompleteController
                                fieldName="vehicle.transmission"
                                label="Transmission Type"
                                placeholder="Select Type"
                                loading={isLoading}
                                required
                                options={TransmissionTypeList}
                                control={control}
                            />
                            <AutocompleteController
                                fieldName="vehicle.fuelType"
                                label="Fuel Type"
                                placeholder="Select Fuel Type"
                                loading={isLoading}
                                required
                                options={FuelTypeList}
                                control={control}
                            />
                            <InputController
                                fieldName="vehicle.engineCapacity"
                                placeholder="1500"
                                label="Engine Capacity in CC"
                                type="number"
                                loading={isLoading}
                                required
                                control={control}
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Other details</div>
                        <TextAreaController
                            label="Description"
                            placeholder="Description of the vehicle for sale"
                            loading={isLoading}
                            required
                            control={control}
                            fieldName="description"
                        />
                        <CheckboxController label="Has Ongoing Lease" loading={isLoading} control={control} fieldName="hasOnGoingLease" />
                    </div>
                </div>
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">
                            Images <span className="text-error">*</span>
                        </div>
                        {isLoading ? (
                            <ListingImageUpload loading={isLoading} />
                        ) : (
                            <Controller
                                name="vehicle.vehicleImages"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <ListingImageUpload
                                        files={field.value}
                                        setFiles={(images) => field.onChange(images)}
                                        error={fieldState.error?.message}
                                        ref={field.ref}
                                        title={title || "New Advert Image"}
                                    />
                                )}
                            />
                        )}
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Location Details</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                fieldName="location.city"
                                placeholder="Colombo"
                                label="City"
                                loading={isLoading}
                                required
                                control={control}
                            />
                            <InputController
                                fieldName="location.state"
                                placeholder="Western Province"
                                label="State/Province"
                                loading={isLoading}
                                required
                                control={control}
                            />
                            <InputController
                                fieldName="location.postalCode"
                                placeholder="00001"
                                label="Postal Code"
                                loading={isLoading}
                                type="number"
                                required
                                control={control}
                            />
                            <SelectController
                                label="Country"
                                disabled
                                options={[{ label: "Sri Lanka", value: "LK" }]}
                                placeholder="Select Country"
                                loading={isLoading}
                                required
                                control={control}
                                fieldName="location.country"
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Price Details</div>
                        <InputController
                            fieldName="price.amount"
                            placeholder="40000000"
                            label="Price"
                            type="number"
                            loading={isLoading}
                            required
                            control={control}
                        />
                        <CheckboxController label="Negotiable Price" loading={isLoading} control={control} fieldName="price.isPriceNegotiable" />
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Features</div>
                        <span className="mt-2">
                            <TagSelectController
                                fieldName="vehicle.featureIds"
                                control={control}
                                loading={isLoading}
                                tags={featureOptions}
                                loadingPlaceholderCount={20}
                            />
                        </span>
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
