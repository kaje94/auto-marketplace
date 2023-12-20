"use client";

import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";

export const ScrollToTop: FC = () => {
    const pathname = usePathname();
    useEffect(() => window.document.body?.scrollIntoView(), [pathname]);

    return null;
};
