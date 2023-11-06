"use client";
import qs from "query-string";
import { ErrorComponent } from "@/components/Common";
import { LoginIcon } from "@/icons";
import { SearchParams } from "@/utils/types";

export default function Page({ searchParams }: SearchParams) {
    return (
        <ErrorComponent
            subTitle="Access to the resource is currently restricted. It's possible that your session has expired. Please consider logging in again."
            title="User is not authorized"
        >
            <a className="btn btn-neutral" href={qs.stringifyUrl({ url: "/api/auth/login", query: searchParams })}>
                <LoginIcon className="mr-3" /> Login
            </a>
        </ErrorComponent>
    );
}
