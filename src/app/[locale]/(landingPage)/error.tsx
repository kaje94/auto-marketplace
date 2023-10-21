"use client";
import { ErrorComponent } from "@/components/Common";
import { ErrorPageProps } from "@/utils/types";

export default function Error(props: ErrorPageProps) {
    return (
        <ErrorComponent
            {...props}
            showHome={false}
            subTitle="But do not worry, you can try refreshing this page"
            variant="sm"
            wrapClassnames="!text-base-200"
        />
    );
}
