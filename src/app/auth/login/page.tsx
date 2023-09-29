"use client";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { ErrorComponent } from "@/components/Common";

export default function Page() {
    const searchParams = useSearchParams();
    const search = searchParams.get("callbackUrl");
    const error = searchParams.get("error");
    const [signInError, setSignInError] = useState<any>();

    useEffect(() => {
        if (!signInError && error !== "OAuthSignin") {
            signIn("duende-identityserver6", {
                callbackUrl: search && !search?.includes("auth/login") ? search : "/",
            }).catch((error) => {
                setSignInError(error);
            });
        }
    }, [search, signInError, error]);

    if (signInError || error === "OAuthSignin") {
        return (
            <div className="p-20">
                <ErrorComponent title="Failed to Authenticate" error={signInError} />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-t from-base-300 to-base-100">
            <span className="loading loading-ring loading-lg scale-150 text-base-content"></span>
        </div>
    );
}
