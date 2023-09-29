"use client";

import { ErrorComponent } from "@/components/Common";

export default function Error(props: { error: Error; reset: () => void }) {
    return <ErrorComponent {...props} variant="sm" showReset={false} />;
}
