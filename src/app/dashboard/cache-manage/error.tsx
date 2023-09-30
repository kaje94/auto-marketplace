"use client";
import { ErrorComponent } from "@/components/Common";
import { ErrorPageProps } from "@/utils/types";

export default function Error(props: ErrorPageProps) {
    return <ErrorComponent {...props} />;
}
