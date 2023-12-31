import { Metadata } from "next";
import qs from "query-string";
import { ErrorComponent } from "@/components/Common";
import { LoginIcon } from "@/icons";
import { SearchParams } from "@/utils/types";

const title = "Targabay - Unauthorized Access";
const description =
    "Sorry, you don't have permission to access this page on Targabay. Please ensure you are logged in and have the necessary privileges. For assistance, contact our support team. Targabay - Your trusted online marketplace for automotive enthusiasts.";

export const metadata: Metadata = { title, description, alternates: {}, robots: { index: false, follow: false } };

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
