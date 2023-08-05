"use client";
import { Select, TextArea, Checkbox, TagSelect, Input } from "@/app/_components";
import { ImageUpload } from "../dashboard/my-ads/_components";
import { AddListingReq, VehicleFeature } from "@/utils/types";
import { FC } from "react";
import { FieldError, Controller, UseFormReturn } from "react-hook-form";
import { FuelTypeList, TransmissionTypeList, VehicleConditionList, VehicleTypeList } from "@/utils/constants";

interface Props {
    featureOptions?: VehicleFeature[];
    isLoading?: boolean;
    isMutating?: boolean;
    form?: UseFormReturn<AddListingReq>;
    onMutate?: (values: AddListingReq) => void;
}

export const AdvertForm: FC<Props> = (props) => {
    const { featureOptions = [], isMutating, isLoading, form = {}, onMutate = () => {} } = props;
    const { handleSubmit, formState: { errors } = {}, register = () => {}, control } = form as UseFormReturn<AddListingReq>;

    return (
        <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
            <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Key Specifications</div>
                        <Select
                            label="Type"
                            options={VehicleTypeList}
                            placeholder="Select Type"
                            loading={isLoading}
                            error={(errors?.vehicle?.type as FieldError)?.message}
                            required
                            {...register("vehicle.type")}
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <Input
                                placeholder="Toyota, Nissan, Honda, etc"
                                label="Brand"
                                loading={isLoading}
                                error={errors?.vehicle?.brand?.message}
                                required
                                {...register("vehicle.brand")}
                            />
                            <Input
                                placeholder="Civic, Sunny, Swift, etc"
                                label="Model"
                                loading={isLoading}
                                error={errors?.vehicle?.model?.message}
                                required
                                {...register("vehicle.model")}
                            />
                            <Input
                                placeholder="LX, EX, EX-L, Sport, etc"
                                label="Trim"
                                loading={isLoading}
                                error={errors?.vehicle?.trim?.message}
                                {...register("vehicle.trim")}
                            />
                            <Input
                                placeholder="2008"
                                label="Year of Manufacture"
                                type="number"
                                min={1960}
                                max={new Date().getFullYear()}
                                loading={isLoading}
                                error={errors?.vehicle?.yearOfManufacture?.message}
                                required
                                {...register("vehicle.yearOfManufacture")}
                            />
                            <Input
                                placeholder="2020"
                                label="Year of Registration"
                                type="number"
                                min={1960}
                                max={new Date().getFullYear()}
                                loading={isLoading}
                                error={errors?.vehicle?.yearOfRegistration?.message}
                                required
                                {...register("vehicle.yearOfRegistration")}
                            />
                            <Input
                                placeholder="50000"
                                label="Milage"
                                type="number"
                                loading={isLoading}
                                error={errors?.vehicle?.millage?.message}
                                required
                                {...register("vehicle.millage")}
                            />
                            <Select
                                label="Condition"
                                options={VehicleConditionList}
                                placeholder="Select Condition"
                                loading={isLoading}
                                error={errors?.vehicle?.condition?.message}
                                required
                                {...register("vehicle.condition")}
                            />
                            <Select
                                label="Transmission Type"
                                options={TransmissionTypeList}
                                placeholder="Select Type"
                                loading={isLoading}
                                error={errors?.vehicle?.transmission?.message}
                                required
                                {...register("vehicle.transmission")}
                            />
                            <Select
                                label="Fuel Type"
                                options={FuelTypeList}
                                placeholder="Select Fuel Type"
                                loading={isLoading}
                                error={errors?.vehicle?.fuelType?.message}
                                required
                                {...register("vehicle.fuelType")}
                            />
                            <Input
                                placeholder="1500"
                                label="Engine Capacity in CC"
                                type="number"
                                loading={isLoading}
                                error={errors?.vehicle?.engineCapacity?.message}
                                required
                                {...register("vehicle.engineCapacity")}
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
                        <Checkbox label="Has Ongoing Lease" checkboxClassNames="mt-2" loading={isLoading} />
                    </div>
                </div>
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">
                            Images <span className="text-error">*</span>
                        </div>
                        {/* todo: Add asterisk */}
                        {isLoading ? (
                            <ImageUpload loading={isLoading} />
                        ) : (
                            <Controller
                                name="vehicle.vehicleImages"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <ImageUpload
                                        files={field.value}
                                        setFiles={(images) => field.onChange(images)}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                        )}
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Location Details</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <Input
                                placeholder="Street Name"
                                label="Street"
                                loading={isLoading}
                                error={errors?.location?.street?.message}
                                required
                                {...register("location.street")}
                            />
                            <Input
                                placeholder="Colombo"
                                label="City"
                                loading={isLoading}
                                error={errors?.location?.city?.message}
                                required
                                {...register("location.city")}
                            />
                            <Input
                                placeholder="Colombo"
                                label="State"
                                loading={isLoading}
                                error={errors?.location?.state?.message}
                                required
                                {...register("location.state")}
                            />
                            <Input
                                placeholder="00001"
                                label="Postal Code"
                                type="number"
                                loading={isLoading}
                                error={errors?.location?.postalCode?.message}
                                required
                                {...register("location.postalCode")}
                            />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Price Details</div>
                        <Input
                            placeholder="40000000"
                            label="Price"
                            type="number"
                            loading={isLoading}
                            error={errors?.price?.amount?.message}
                            required
                            {...register("price.amount")}
                        />
                        <Checkbox label="Negotiable Price" checkboxClassNames="mt-2" loading={isLoading} />
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
                <button type="submit" className="btn-neutral btn-wide btn" disabled={isMutating || isLoading}>
                    {isMutating ? "Creating..." : "Create"}
                </button>
            </div>
        </form>
    );
};
