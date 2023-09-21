"use client";
import { ErrorComponent } from "@/app/_components";

export default function Error(props: { error: Error; reset: () => void }) {
    return <ErrorComponent {...props} variant="sm" showReset={false} />;
}
