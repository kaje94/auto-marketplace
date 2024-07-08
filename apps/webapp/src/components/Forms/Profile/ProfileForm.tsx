"use client";
import { PartialMessage } from "@bufbuild/protobuf";
import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { getCitiesOfState, getStatesOfCountry } from "@/actions/locationActions";
import { Avatar } from "@/components/Common";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { CheckboxController } from "@/components/FormElements/Checkbox";
import { InputController } from "@/components/FormElements/Input";
import { BOT_LOCALE } from "@/utils/constants";
import { COUNTRIES } from "@/utils/countries";
import { LabelValue, UpdateProfileReq } from "@/utils/types";

interface Props {
    form?: UseFormReturn<UpdateProfileReq>;
    gridClassnames?: string;
    isLoading?: boolean;
    isMutating?: boolean;
    locationSectionClassnames?: string;
    onMutate?: (values: UpdateProfileReq) => void;
    showFooter?: boolean;
    showHeader?: boolean;
    userData?: PartialMessage<UserProfile>;
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
        locationSectionClassnames,
    } = props;
    const { handleSubmit, formState: { isDirty } = {}, control, watch = (_: string) => "" } = form as UseFormReturn<UpdateProfileReq>;

    const country = watch("address.country");
    const state = watch("address.state");
    const city = watch("address.city");

    const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === country);
    const countryPhoneCode = COUNTRIES[countryCode || ""]?.[3];

    const countryList: LabelValue[] = Object.keys(COUNTRIES).map((key) => ({
        label: COUNTRIES[key]?.[0]!,
        value: COUNTRIES[key]?.[0]!,
    }));

    const { data: states = [], isFetching: isLoadingStates } = useQuery({
        queryFn: () => getStatesOfCountry(countryCode!),
        enabled: !!countryCode && countryCode !== BOT_LOCALE,
        queryKey: ["country-states", { locale: countryCode }],
        select: (data) => data.states,
        onSettled: (data, _) => {
            if (!!data?.length && !data?.some((item) => item.stateName === state)) {
                (form as UseFormReturn<UpdateProfileReq>).setValue("address.state", "");
                (form as UseFormReturn<UpdateProfileReq>).setValue("address.city", "");
            }
        },
    });

    const stateList = states?.map((item) => ({ label: item.stateName, value: item.stateName }) as LabelValue);

    const stateCode = states.find((item) => item.stateName === state)?.id;

    const { data: cityList = [], isFetching: isLoadingCities } = useQuery({
        queryFn: () => getCitiesOfState(stateCode!),
        enabled: !!countryCode && !!stateCode,
        queryKey: ["country-state-cities", { locale: countryCode, stateCode }],
        select: (data) => data?.cities?.map((item) => ({ label: item, value: item }) as LabelValue),
        onSettled: (data, _) => {
            if (!!data?.length && !data?.some((item) => item.label === city)) {
                (form as UseFormReturn<UpdateProfileReq>).setValue("address.city", "");
            }
        },
    });

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
                                <div className="text-xl font-bold text-neutral md:text-2xl xl:text-4xl">{userData?.name}</div>
                            )}
                        </div>
                    </div>
                )}

                <div className={clsx("grid w-full gap-1 lg:grid-cols-2 lg:gap-4", gridClassnames)}>
                    <div className={clsx("grid gap-1", locationSectionClassnames)}>
                        <div className="divider col-span-full mt-4">Location Details</div>
                        <AutocompleteController
                            control={control}
                            fieldName="address.country"
                            label="Country"
                            options={countryList}
                            placeholder="Select Country"
                            required
                        />

                        <AutocompleteController
                            control={control}
                            fieldName="address.state"
                            label="State/Province"
                            loading={isLoadingStates}
                            options={stateList}
                            placeholder="State or Province Name"
                            required
                        />

                        <AutocompleteController
                            control={control}
                            fieldName="address.city"
                            label="City"
                            loading={isLoadingCities}
                            options={cityList}
                            placeholder="City Name"
                            required
                        />

                        <InputController
                            control={control}
                            fieldName="address.postalCode"
                            label="Postal Code"
                            loading={isLoading}
                            placeholder="00001"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="divider mt-4">User Details</div>
                        <InputController
                            control={control}
                            fieldName="phoneNumber"
                            inputPrefix={countryPhoneCode}
                            label="Phone Number"
                            loading={isLoading}
                            placeholder="0000000000"
                            type="tel"
                        />
                        <CheckboxController
                            control={control}
                            fieldName="isDealership"
                            label="Are you a vehicle dealer or dealership?"
                            loading={isLoading}
                        />
                    </div>
                </div>
            </div>

            {showFooter && (
                <div className="mt-5 flex justify-end">
                    <button
                        className="btn btn-neutral btn-wide"
                        disabled={isMutating || isLoading || !isDirty}
                        type="submit"
                        onClick={() => handleSubmit((values) => onMutate(values))}
                    >
                        {isMutating ? "Updating..." : "Update"}
                    </button>
                </div>
            )}
        </form>
    );
};
