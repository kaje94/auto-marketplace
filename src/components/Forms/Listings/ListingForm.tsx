"use client";
import { FC } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { CheckboxController } from "@/components/FormElements/Checkbox";
import { InputController } from "@/components/FormElements/Input";
import { SelectController } from "@/components/FormElements/Select";
import { TagSelectController } from "@/components/FormElements/TagSelect";
import { TextAreaController } from "@/components/FormElements/TextArea";
import { YearInputController } from "@/components/FormElements/YearInput";
import { FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList } from "@/utils/constants";
import { CreateListingReq, VehicleFeature } from "@/utils/types";
import { ListingImageUpload } from "./ListingImageUpload";

interface Props {
    featureOptions?: VehicleFeature[];
    form?: UseFormReturn<CreateListingReq>;
    isLoading?: boolean;
    isMutating?: boolean;
    onMutate?: (values: CreateListingReq) => void;
    submitButton?: {
        disableIfCleanForm?: boolean;
        mutatingText?: string;
        text?: string;
    };
    title?: string;
}

export const ListingForm: FC<Props> = (props) => {
    const { featureOptions = [], isMutating, isLoading, form = {}, onMutate = () => {}, submitButton = {}, title } = props;
    const { handleSubmit, formState: { isDirty, errors } = {}, control } = form as UseFormReturn<CreateListingReq>;

    return (
        <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
            <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Key Specifications</div>
                        <AutocompleteController
                            control={control}
                            fieldName="vehicle.type"
                            label="Type"
                            loading={isLoading}
                            options={VehicleTypeList}
                            placeholder="Select Type"
                            required
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                control={control}
                                fieldName="vehicle.brand"
                                label="Brand"
                                loading={isLoading}
                                placeholder="Toyota, Nissan, Honda, etc"
                                required
                            />
                            <InputController
                                control={control}
                                fieldName="vehicle.model"
                                label="Model"
                                loading={isLoading}
                                placeholder="Civic, Sunny, Swift, etc"
                                required
                            />
                            <InputController
                                control={control}
                                fieldName="vehicle.trim"
                                label="Trim"
                                loading={isLoading}
                                placeholder="LX, EX, EX-L, Sport, etc"
                            />
                            <YearInputController
                                control={control}
                                fieldName="vehicle.yearOfManufacture"
                                gridCols="grid-cols-3"
                                label="Year of Manufacture"
                                loading={isLoading}
                                placeholder="2000"
                                required
                            />
                            <YearInputController
                                control={control}
                                fieldName="vehicle.yearOfRegistration"
                                gridCols="grid-cols-3"
                                label="Year of Registration"
                                loading={isLoading}
                                placeholder="2010"
                                required
                            />
                            <InputController
                                control={control}
                                fieldName="vehicle.millage"
                                label="Mileage"
                                loading={isLoading}
                                placeholder="50000"
                                required
                                type="number"
                            />
                            <AutocompleteController
                                control={control}
                                fieldName="vehicle.condition"
                                label="Condition"
                                loading={isLoading}
                                options={VehicleConditionList}
                                placeholder="Select Condition"
                                required
                            />
                            <AutocompleteController
                                control={control}
                                fieldName="vehicle.transmission"
                                label="Transmission Type"
                                loading={isLoading}
                                options={TransmissionTypeList}
                                placeholder="Select Type"
                                required
                            />
                            <AutocompleteController
                                control={control}
                                fieldName="vehicle.fuelType"
                                label="Fuel Type"
                                loading={isLoading}
                                options={FuelTypeList}
                                placeholder="Select Fuel Type"
                                required
                            />
                            <InputController
                                control={control}
                                fieldName="vehicle.engineCapacity"
                                label="Engine Capacity in CC"
                                loading={isLoading}
                                placeholder="1500"
                                required
                                type="number"
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Other details</div>
                        <TextAreaController
                            control={control}
                            fieldName="description"
                            label="Description"
                            loading={isLoading}
                            placeholder="Description of the vehicle for sale"
                            required
                        />
                        <CheckboxController
                            control={control}
                            fieldName="hasOnGoingLease"
                            label="Is there an active lease for the vehicle?"
                            loading={isLoading}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">
                            Images <span className="text-error">*</span>
                        </div>
                        {isLoading ? (
                            <ListingImageUpload loading={isLoading} />
                        ) : (
                            <Controller
                                control={control}
                                name="vehicle.vehicleImages"
                                render={({ field, fieldState }) => (
                                    <ListingImageUpload
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
                        <div className="stat-title">Location Details</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                control={control}
                                fieldName="location.city"
                                label="City"
                                loading={isLoading}
                                placeholder="Colombo"
                                required
                            />
                            <InputController
                                control={control}
                                fieldName="location.state"
                                label="State/Province"
                                loading={isLoading}
                                placeholder="Western Province"
                                required
                            />
                            <InputController
                                control={control}
                                fieldName="location.postalCode"
                                label="Postal Code"
                                loading={isLoading}
                                placeholder="00001"
                                required
                                type="number"
                            />
                            <SelectController
                                control={control}
                                disabled
                                fieldName="location.country"
                                label="Country"
                                loading={isLoading}
                                options={[{ label: "Sri Lanka", value: "LK" }]}
                                placeholder="Select Country"
                                required
                            />
                        </div>
                    </div>
                    <div className="card stat bg-base-100 p-4 shadow">
                        <div className="stat-title">Price Details</div>
                        <InputController
                            control={control}
                            fieldName="price.amount"
                            label="Price"
                            loading={isLoading}
                            placeholder="40000000"
                            required
                            type="number"
                        />
                        <CheckboxController
                            control={control}
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
                                fieldName="vehicle.featureIds"
                                loading={isLoading}
                                loadingPlaceholderCount={20}
                                tags={featureOptions}
                            />
                        </span>
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
