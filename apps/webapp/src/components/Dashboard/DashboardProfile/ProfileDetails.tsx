import { Session } from "@auth0/nextjs-auth0";
import { PartialMessage } from "@bufbuild/protobuf";
import { clsx } from "clsx";
import { FC, ReactNode } from "react";
import { UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { Avatar, LinkWithLocale } from "@/components/Common";
import { AlertCircleIcon, EditIcon } from "@/icons";
import { COUNTRIES } from "@/utils/countries";
import { getRandomItem, isIncompleteUserProfile } from "@/utils/helpers";
import { CloseAccountButton } from "./CloseAccountButton";

interface Props {
    loading?: boolean;
    profile?: PartialMessage<UserProfile>;
    session?: Session | null;
}

const DetailsItem = ({ title, value, loading }: { loading?: boolean; title: string; value: ReactNode }) => (
    <div>
        <div className="text-xs opacity-50">{title}</div>

        {loading ? (
            <div className={clsx("my-0.5 h-5 animate-pulse bg-base-200", getRandomItem(["w-32", "w-40", "w-28", "w-48"]))} />
        ) : (
            <div>{value}</div>
        )}
    </div>
);

/** Profile details view within user's dashboard */
export const ProfileDetails: FC<Props> = ({ profile, session, loading }) => {
    const isProfileIncomplete = profile ? isIncompleteUserProfile(profile) : false;

    let userType = "User";
    if (profile?.data?.vehicleDealer) {
        userType = "Car Dealership";
    } else if (session?.user.isAdmin) {
        userType = "Admin";
    }

    const countryPhoneCode = COUNTRIES[profile?.data?.countryCode || ""]?.[3];

    return (
        <>
            {!loading && isProfileIncomplete && (
                <div className="alert alert-warning mb-6 mt-4 shadow-lg md:mt-1">
                    <AlertCircleIcon />
                    <div>
                        <h3 className="font-bold">Incomplete Profile</h3>
                        <div className="text-xs">To enjoy a seamless experience, please take a moment to update your profile.</div>
                    </div>
                    <LinkWithLocale href="/dashboard/profile/edit">
                        <button className="btn btn-ghost btn-sm">Update Profile</button>
                    </LinkWithLocale>
                </div>
            )}

            <div className="card stat flex flex-col items-center gap-4 bg-base-100 p-4 shadow ">
                <div className="rounded-box flex w-full flex-col items-center gap-2 bg-gradient-to-t from-base-300 to-base-200 p-2 md:p-3 lg:gap-4 xl:p-6">
                    <div className="relative mt-1 flex h-16 w-16 items-center justify-center rounded-full ring ring-offset-base-100 md:h-24 md:w-24 xl:h-32 xl:w-32">
                        <Avatar loading={loading} url={profile?.picture} width={128} />
                    </div>
                    <div className="flex w-full flex-1 flex-col items-center justify-center gap-1 text-center">
                        {loading ? (
                            <div className="h-10 w-4/5 animate-pulse rounded bg-gray-400 bg-opacity-40 md:w-2/3 xl:w-1/2" />
                        ) : (
                            <div className="text-xl font-bold text-neutral md:text-2xl xl:text-4xl">{profile?.name}</div>
                        )}
                        {loading ? (
                            <div className="badge badge-lg w-32 animate-pulse bg-gray-400 bg-opacity-40" />
                        ) : (
                            <div className="badge badge-outline mt-1">{userType}</div>
                        )}
                    </div>
                </div>
                <div className="grid w-full gap-4 lg:grid-cols-2 xl:gap-7 2xl:gap-8">
                    <div className="flex flex-col gap-1">
                        <div className="text-lg font-bold">Contact Details</div>
                        <div className="flex flex-col gap-2">
                            <DetailsItem loading={loading} title="Email" value={profile?.email ?? "-"} />
                            <DetailsItem
                                loading={loading}
                                title="Phone Number"
                                value={
                                    <>
                                        <span className="font-light opacity-70">{countryPhoneCode ? `(${countryPhoneCode}) ` : ""}</span>
                                        {profile?.data?.phone ?? "-"}
                                    </>
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-lg font-bold">Location Details</div>
                        <div className="flex flex-col gap-2">
                            <DetailsItem loading={loading} title="Country" value={COUNTRIES[profile?.data?.countryCode!]?.[0] ?? "-"} />
                            <DetailsItem loading={loading} title="State" value={profile?.data?.state ?? "-"} />
                            <DetailsItem loading={loading} title="City" value={profile?.data?.city ?? "-"} />
                            <DetailsItem loading={loading} title="Postal Code" value={profile?.data?.postalCode ?? "-"} />
                        </div>
                    </div>
                </div>

                {!loading && profile && (
                    <div className="mt-3 flex w-full flex-wrap justify-end gap-2">
                        <CloseAccountButton userId={profile?.email!} />
                        <LinkWithLocale href="/dashboard/profile/edit">
                            <button className="btn btn-neutral">
                                <EditIcon />
                                Update Profile
                            </button>
                        </LinkWithLocale>
                    </div>
                )}
            </div>
        </>
    );
};
