import { FC } from "react";
import Image from "next/image";
import { ListingUser } from "@/utils/types";
import clsx from "clsx";

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
                        <Image
                            src="https://lh3.googleusercontent.com/a/AAcHTtd7MmSI5uFKspCkopw4j4fnk64GQYhA2zL-EOKSdjTtNxk=s96-c-rg-br100"
                            height={80}
                            width={80}
                            alt="profile-image"
                            className="object-cover"
                        />
                    )}
                </div>
            </div>
            {loading ? (
                <div className="flex w-full flex-col items-center justify-center gap-3">
                    <div className="h-5 w-4/6 animate-pulse bg-base-200" />
                    <div className="h-5 w-1/2 animate-pulse bg-base-200" />
                </div>
            ) : (
                <>
                    <div className="text-center text-2xl font-extrabold">
                        {user?.firstName} {user?.lastName}
                    </div>
                    <div className="mt-2 flex flex-col items-center gap-1">
                        {user?.phone && (
                            <div className="font-light">
                                Contact Number:<span className="ml-1 font-semibold text-primary-content">{user?.phone}</span>
                            </div>
                        )}
                        <p className="w-full max-w-xs overflow-hidden truncate text-center font-light hover:overflow-visible">
                            Email:
                            <span className="ml-1 font-semibold text-primary-content">{user?.email}</span>
                        </p>
                    </div>
                </>
            )}
        </>
    );
};
