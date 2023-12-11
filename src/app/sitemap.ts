import { MetadataRoute } from "next";
import queryString from "query-string";
import { env } from "@/env.mjs";
// todo : recheck this
// import { api } from "@/utils/api";
import { VehicleTypeList } from "@/utils/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const searchMaps: MetadataRoute.Sitemap = [];
    // const brands = await api.getVehicleBrands();

    // for (const brand of brands) {
    //     searchMaps.push({
    //         url: `${env.AUTH0_BASE_URL}/search?${queryString.stringify({ Brand: brand.name })}`,
    //         lastModified: new Date(),
    //         changeFrequency: "hourly",
    //         priority: 0.1,
    //     });
    // }

    for (const vehicleType of VehicleTypeList) {
        searchMaps.push({
            url: `${env.AUTH0_BASE_URL}/search?${queryString.stringify({ VehicleType: vehicleType.value })}`,
            lastModified: new Date(),
            changeFrequency: "hourly",
            priority: 0.2,
        });
    }

    return [
        { url: env.AUTH0_BASE_URL, lastModified: new Date(), changeFrequency: "yearly", priority: 1 },
        { url: `${env.AUTH0_BASE_URL}/search`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.8 },
        { url: `${env.AUTH0_BASE_URL}/about-us`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
        { url: `${env.AUTH0_BASE_URL}/why-choose-us`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.27 },
        { url: `${env.AUTH0_BASE_URL}/contact-us`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
        { url: `${env.AUTH0_BASE_URL}/safety-tips`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.25 },
        { url: `${env.AUTH0_BASE_URL}/faqs`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
        { url: `${env.AUTH0_BASE_URL}/terms-of-use`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.25 },
        { url: `${env.AUTH0_BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.25 },
        { url: `${env.AUTH0_BASE_URL}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.25 },
        { url: `${env.AUTH0_BASE_URL}/dashboard/new-listing`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
        { url: `${env.AUTH0_BASE_URL}/dashboard/profile`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        ...searchMaps,
    ];
}
