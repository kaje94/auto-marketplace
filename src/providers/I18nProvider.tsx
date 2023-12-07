"use client";

import React from "react";
import { I18nProviderClient } from "@/locales/client";

export const I18nProvider = ({ children }: React.PropsWithChildren) => {
    return <I18nProviderClient locale="en">{children}</I18nProviderClient>;
};
