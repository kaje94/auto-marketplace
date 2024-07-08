import { MetadataRoute } from "next";
import queryString from "query-string";
import { env } from "@/env.mjs";
import { VEHICLE_BRANDS } from "@/utils/brands";
import { VehicleTypeList } from "@/utils/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const searchMaps: MetadataRoute.Sitemap = [];
    const BOT_LOCALE = "CTRY";

    for (const brand of VEHICLE_BRANDS) {
        searchMaps.push({
            url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/search?${queryString.stringify({ Brand: brand })}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.1,
        });
    }

    for (const vehicleType of VehicleTypeList) {
        searchMaps.push({
            url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/search?${queryString.stringify({ VehicleType: vehicleType.value })}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.2,
        });
    }

    return [
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}`, lastModified: new Date(), changeFrequency: "yearly", priority: 1 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/search`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/about-us`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/why-choose-us`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.27 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/contact-us`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/safety-tips`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.25 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/faqs`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/terms-of-use`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.25 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.25 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.25 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/dashboard/new-listing`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
        { url: `${env.AUTH0_BASE_URL}/${BOT_LOCALE}/dashboard/profile`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        ...searchMaps,
    ];
}
