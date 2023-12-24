"use client";

import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";

/** Client side component that will forcefully scroll to the top of the page whenever page changes */
export const ScrollToTop: FC = () => {
    const pathname = usePathname();
    useEffect(() => window.document.body?.scrollIntoView(), [pathname]);

    return null;
};
