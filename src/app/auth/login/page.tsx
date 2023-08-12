"use client";
import { ErrorComponent } from "@/app/_components";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get("callbackUrl");
    const errorParam = searchParams.get("error");
    const [signInError, setSignInError] = useState<any>();

    useEffect(() => {
        if (!errorParam && !signInError) {
            signIn("duende-identityserver6", {
                callbackUrl: search && !search?.includes("auth/login") ? search : "/",
            }).catch((error) => {
                setSignInError(error);
            });
        }
    }, [search, errorParam, signInError]);

    if (errorParam || signInError) {
        return <ErrorComponent title="Failed to Authenticate" error={signInError} />;
    }
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-t from-base-300 to-base-100">
            <span className="loading loading-ring loading-lg scale-150 text-base-content"></span>
        </div>
    );
};

export default LoginPage;
