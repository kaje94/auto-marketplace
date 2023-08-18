"use client";
import { ErrorComponent } from "@/app/_components";

const ListingErrorPage = (props: { error: Error; reset: () => void }) => {
    return <ErrorComponent {...props} />;
};

export default ListingErrorPage;
