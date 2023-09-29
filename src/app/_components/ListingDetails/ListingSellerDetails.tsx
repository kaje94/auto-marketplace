import { FC } from "react";
import Image from "next/image";
import { ListingUser } from "@/utils/types";
import clsx from "clsx";
import { Avatar } from "@/app/_components/Common/Avatar";

interface Props {
    user?: ListingUser;
    loading?: boolean;
}

export const ListingSellerDetails: FC<Props> = ({ user, loading }) => {
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
                    {user && (
                        <Avatar
                            url="https://lh3.googleusercontent.com/a/AAcHTtd7MmSI5uFKspCkopw4j4fnk64GQYhA2zL-EOKSdjTtNxk=s96-c-rg-br100"
                            width={80}
                        />
                    )}
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
                    <div className="w-full flex-wrap !break-all text-center text-2xl font-extrabold">
                        {user?.firstName} {user?.lastName}
                    </div>
                    <div className="mt-2 flex flex-col items-center gap-1">
                        <p className="w-full max-w-xs flex-wrap !break-all text-center font-light">
                            Email: <span className="font-semibold text-primary-content">{user?.email}</span>
                        </p>
                        {user?.phone && (
                            <p className="w-full max-w-xs flex-wrap !break-all text-center font-light">
                                Contact Number:
                                <span className="font-semibold text-primary-content">{user?.phone}</span>
                            </p>
                        )}
                        <div className="badge badge-outline badge-lg mt-2">Car Dealer</div>
                    </div>
                </>
            )}
        </>
    );
};
