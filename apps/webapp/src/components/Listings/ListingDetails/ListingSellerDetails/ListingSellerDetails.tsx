import { clsx } from "clsx";
import { FC } from "react";
import { UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { Avatar } from "@/components/Common/Avatar";
import { COUNTRIES } from "@/utils/countries";

interface Props {
    loading?: boolean;
    user?: UserProfile;
}

export const ListingSellerDetails: FC<Props> = ({ user, loading }) => {
    const countryPhoneCode = COUNTRIES[user?.data?.countryCode || ""]?.[3];
    return (
        <>
            <div className="avatar my-4">
                <div
                    className={clsx({
                        "w-20 rounded-full ring ring-offset-2 ring-offset-base-100 bg-base-200": true,
                        "ring-primary": !loading,
                        "ring-base-300 animate-pulse": loading,
                    })}
                >
                    {user && <Avatar url={user?.picture} width={80} />}
                </div>
            </div>
            {loading ? (
                <div className="flex w-full flex-col items-center justify-center gap-3">
                    <div className="h-5 w-4/6 animate-pulse bg-base-200" />
                    <div className="h-5 w-1/2 animate-pulse bg-base-200" />
                    <div className="h-5 w-1/3 animate-pulse bg-base-200" />
                </div>
            ) : (
                <>
                    <div className="w-full flex-wrap !break-all text-center text-2xl font-extrabold">{user?.name}</div>
                    <div className="mt-2 flex flex-col items-center gap-1">
                        <a className="w-full max-w-xs flex-wrap !break-all text-center font-light" href={`mailto:${user?.email}`}>
                            Email: <span className="link-hover link font-semibold text-primary-content">{user?.email}</span>
                        </a>
                        {user?.data?.phone && (
                            <a className="w-full max-w-xs flex-wrap !break-all text-center font-light" href={`tel:${user?.data?.phone}`}>
                                Contact Number:
                                <span className="link-hover link font-semibold text-primary-content">
                                    <>
                                        <span className="font-light opacity-70">{countryPhoneCode ? `(${countryPhoneCode}) ` : ""}</span>
                                        {user?.data?.phone ?? "-"}
                                    </>
                                </span>
                            </a>
                        )}
                        <div className="badge badge-outline badge-lg mt-2">Car Dealer</div>
                    </div>
                </>
            )}
        </>
    );
};
