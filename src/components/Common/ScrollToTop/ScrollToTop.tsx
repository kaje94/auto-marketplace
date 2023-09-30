"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
// todo: move this, footer, navbar into layouts
export const ScrollToTop = () => {
    const pathname = usePathname();
    useEffect(() => window.document.body?.scrollIntoView(), [pathname]);

    return null;
};
