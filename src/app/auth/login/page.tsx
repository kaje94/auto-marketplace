"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get("callbackUrl");

    useEffect(() => {
        signIn("duende-identityserver6", {
            callbackUrl: search && !search?.includes("auth/login") ? search : "/",
        });
    }, [search]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-t from-base-300 to-base-100">
            <span className="loading loading-ring loading-lg scale-150 text-base-content"></span>
        </div>
    );
};

export default LoginPage;
