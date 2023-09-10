"use client";
import { Select, TextArea, Checkbox, TagSelect, Input } from "@/app/_components";
import { CreateListingReq, VehicleFeature } from "@/utils/types";
import { FC } from "react";
import { FieldError, Controller, UseFormReturn } from "react-hook-form";
import { FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList, YearRangeList } from "@/utils/constants";
import { AutocompleteController } from "../../FormElements/AutoComplete";
import { ListingImageUpload } from "./ListingImageUpload";
import { InputController } from "../../FormElements/Input";

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
}

export const ListingForm: FC<Props> = (props) => {
    const { featureOptions = [], isMutating, isLoading, form = {}, onMutate = () => {}, submitButton = {} } = props;
    const { handleSubmit, formState: { errors, isDirty } = {}, register = () => {}, control, setValue } = form as UseFormReturn<CreateListingReq>;

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
                            setValue={setValue}
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController
                                fieldName="vehicle.brand"
                                placeholder="Toyota, Nissan, Honda, etc"
                                label="Brand"
                                required
                                control={control}
                            />
                            <InputController
                                fieldName="vehicle.model"
                                placeholder="Civic, Sunny, Swift, etc"
                                label="Model"
                                required
                                control={control}
                            />
                            <InputController fieldName="vehicle.trim" placeholder="LX, EX, EX-L, Sport, etc" label="Trim" control={control} />
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
                                setValue={setValue}
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
                                setValue={setValue}
                            />
                            <InputController
                                fieldName="vehicle.millage"
                                placeholder="50000"
                                label="Milage"
                                type="number"
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
                                setValue={setValue}
                            />
                            <AutocompleteController
                                fieldName="vehicle.transmission"
                                label="Transmission Type"
                                placeholder="Select Type"
                                loading={isLoading}
                                required
                                options={TransmissionTypeList}
                                control={control}
                                setValue={setValue}
                            />
                            <AutocompleteController
                                fieldName="vehicle.fuelType"
                                label="Fuel Type"
                                placeholder="Select Fuel Type"
                                loading={isLoading}
                                required
                                options={FuelTypeList}
                                control={control}
                                setValue={setValue}
                            />
                            <InputController
                                fieldName="vehicle.engineCapacity"
                                placeholder="1500"
                                label="Engine Capacity in CC"
                                type="number"
                                required
                                control={control}
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Other details</div>
                        <TextArea
                            label="Description"
                            placeholder="Description of the vehicle for sale"
                            loading={isLoading}
                            error={errors?.description?.message}
                            required
                            {...register("description")}
                        />
                        <Checkbox label="Has Ongoing Lease" checkboxClassNames="mt-2" loading={isLoading} {...register("hasOnGoingLease")} />
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
                                    />
                                )}
                            />
                        )}
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Location Details</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <InputController fieldName="location.city" placeholder="Colombo" label="City" required control={control} />
                            <InputController
                                fieldName="location.state"
                                placeholder="Western Province"
                                label="State/Province"
                                required
                                control={control}
                            />
                            <InputController
                                fieldName="location.postalCode"
                                placeholder="00001"
                                label="Postal Code"
                                type="number"
                                required
                                control={control}
                            />

                            <Select
                                label="Country"
                                disabled
                                options={[{ label: "Sri Lanka", value: "LK" }]}
                                placeholder="Select Country"
                                loading={isLoading}
                                error={(errors?.location?.country as FieldError)?.message}
                                required
                                {...register("location.country")}
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Price Details</div>
                        <InputController fieldName="price.amount" placeholder="40000000" label="Price" type="number" required control={control} />
                        <Checkbox label="Negotiable Price" checkboxClassNames="mt-2" loading={isLoading} {...register("price.isPriceNegotiable")} />
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Features</div>
                        <span className="mt-2">
                            {isLoading ? (
                                <TagSelect tags={featureOptions} loading={isLoading} />
                            ) : (
                                <Controller
                                    name="vehicle.featureIds"
                                    control={control}
                                    render={({ field: { value = [], onChange } }) => (
                                        <TagSelect tags={featureOptions} selectedTags={value} onSelect={onChange} />
                                    )}
                                />
                            )}
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
