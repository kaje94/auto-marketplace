"use client";
import { clsx } from "clsx";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { Avatar } from "@/components/Common";
import { CheckboxController } from "@/components/FormElements/Checkbox";
import { InputController } from "@/components/FormElements/Input";
import { SelectController } from "@/components/FormElements/Select";
import { ListingUser, UpdateProfileReq } from "@/utils/types";

interface Props {
    form?: UseFormReturn<UpdateProfileReq>;
    gridClassnames?: string;
    isLoading?: boolean;
    isMutating?: boolean;
    onMutate?: (values: UpdateProfileReq) => void;
    showFooter?: boolean;
    showHeader?: boolean;
    userData?: ListingUser;
    wrapClassnames?: string;
}

export const ProfileForm: FC<Props> = (props) => {
    const {
        isMutating,
        showFooter = true,
        showHeader = true,
        isLoading,
        form = {},
        onMutate = () => {},
        userData,
        wrapClassnames,
        gridClassnames,
    } = props;
    const { handleSubmit, formState: { isDirty } = {}, control } = form as UseFormReturn<UpdateProfileReq>;

    return (
        <form onSubmit={handleSubmit ? handleSubmit((values) => onMutate(values)) : undefined}>
            <div className={clsx("card stat flex flex-col gap-2 bg-base-100 p-4 shadow", wrapClassnames)}>
                {showHeader && (
                    <div className="rounded-box flex w-full flex-col items-center gap-2 bg-gradient-to-t from-base-300 to-base-200 p-2 md:p-3 lg:gap-4 xl:p-6">
                        <div className="relative mt-1 flex h-16 w-16 items-center justify-center rounded-full ring ring-offset-base-100 md:h-24 md:w-24 xl:h-32 xl:w-32">
                            <Avatar loading={isLoading} url={userData?.picture} width={128} />
                        </div>
                        <div className="flex w-full flex-1 flex-col items-center justify-center gap-1 text-center">
                            {isLoading ? (
                                <div className="h-10 w-4/5 animate-pulse rounded bg-gray-400 bg-opacity-40 md:w-2/3 xl:w-1/2" />
                            ) : (
                                <div className="text-xl font-bold text-neutral md:text-2xl xl:text-4xl">{userData?.fullName}</div>
                            )}
                        </div>
                    </div>
                )}

                <div className={clsx("grid w-full gap-4 lg:grid-cols-2", gridClassnames)}>
                    <div className="flex flex-col gap-1">
                        <div className="divider mt-8">User Details</div>
                        <InputController
                            control={control}
                            fieldName="phoneNumber"
                            inputPrefix="94"
                            label="Contact Number"
                            loading={isLoading}
                            type="tel"
                        />
                        <CheckboxController control={control} fieldName="isDealership" label="Is a vehicle dealership?" loading={isLoading} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="divider mt-8">Location Details</div>
                        <InputController control={control} fieldName="address.city" label="City" loading={isLoading} placeholder="Colombo" required />
                        <InputController
                            control={control}
                            fieldName="address.state"
                            label="State/Province"
                            loading={isLoading}
                            placeholder="Western Province"
                            required
                        />
                        <InputController
                            control={control}
                            fieldName="address.postalCode"
                            label="Postal Code"
                            loading={isLoading}
                            placeholder="00001"
                            required
                            type="number"
                        />
                        <SelectController
                            control={control}
                            disabled
                            fieldName="address.country"
                            label="Country"
                            loading={isLoading}
                            options={[{ label: "Sri Lanka", value: "LK" }]}
                            placeholder="Select Country"
                            required
                        />
                    </div>
                </div>
            </div>

            {showFooter && (
                <div className="mt-5 flex justify-end">
                    <button
                        className="btn btn-neutral btn-wide"
                        disabled={isMutating || isLoading || !isDirty}
                        onClick={() => handleSubmit((values) => onMutate(values))}
                        type="submit"
                    >
                        {isMutating ? "Updating..." : "Update"}
                    </button>
                </div>
            )}
        </form>
    );
};
