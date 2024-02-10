import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import qs from "query-string";
import { SearchGrid } from "@/components/Listings/PostedListingsSearchGrid";
import { api } from "@/utils/api";
import { BOT_LOCALE } from "@/utils/constants";
import { COUNTRIES, getAlternativeLinks } from "@/utils/countries";
import { getFormattedCurrency, getLocationString, toSEOFriendlyTitleUrl, unCamelCase } from "@/utils/helpers";
import { convertToSEOFriendlyImageURL } from "@/utils/imageUtils";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { ListingItem, ListingItems, LocalePathParam, PaginatedResponse, PostedListingsFilterReq, SearchParams } from "@/utils/types";

const metadataDesc =
    "Refine your search criteria and discover the perfect automotive match. Targabay – Simplifying the search process for a seamless and personalized buying experience";
const metadataTitle = "Targabay - Explore and Discover Listings";

const getSearchTitleMetadata = (filters: PostedListingsFilterReq, locale: string, resultsCount: number, pageNumber = 1): string => {
    let title = metadataTitle;
    const items: string[] = [];
    const country = COUNTRIES[locale];
    if (filters.Title) {
        items.push(filters.Title);
    }
    if (filters.Brand) {
        items.push(`Brand:${filters.Brand}`);
    }
    if (filters.Model) {
        items.push(`Model:${filters.Model}`);
    }
    if (filters.VehicleType) {
        items.push(unCamelCase(filters.Model));
    }
    if (filters.Condition) {
        items.push(unCamelCase(filters.Condition));
    }
    if (filters.FuelType) {
        items.push(unCamelCase(filters.Model));
    }
    if (filters.Transmission) {
        items.push(unCamelCase(filters.Transmission));
    }
    if (country) {
        if (filters.MaxPrice && filters.MinPrice) {
            items.push(
                `Price Range:${getFormattedCurrency(filters.MinPrice, country?.[1]!)}-${getFormattedCurrency(filters.MaxPrice, country?.[1]!)}`,
            );
        } else if (filters.MaxPrice) {
            items.push(`Price Upto:${getFormattedCurrency(filters.MaxPrice, country?.[1]!)}`);
        } else if (filters.MinPrice) {
            items.push(`Price From:${getFormattedCurrency(filters.MinPrice, country?.[1]!)}`);
        }
    }

    if (filters.YomStartDate && filters.YomEndDate) {
        items.push(`Manufactured Between:${filters.YomStartDate}-${filters.YomEndDate}`);
    } else if (filters.YomStartDate) {
        items.push(`Manufactured From:${filters.YomStartDate}`);
    } else if (filters.YomEndDate) {
        items.push(`Manufactured Before:${filters.YomEndDate}`);
    }
    title = `${title}${items.length > 0 ? ` for ${items.join("|")}` : ""} in ${getLocationString({
        city: filters.City!,
        state: filters.State!,
        country: country?.[0] ?? "",
    })}`;
    title = `${title} ${pageNumber > 1 ? ` Page-${pageNumber}` : ""}`;
    title = `${title} ${resultsCount > 0 ? ` (${resultsCount} found)` : ` (No listings found)`}`;
    return title;
};

const getSearchDescriptionMetadata = (listings: PaginatedResponse & ListingItems): string => {
    return listings.items.length > 0 ? `Search results: ${listings.items.map((item) => item.title).join(",")}` : "";
};

const getTitleMetadata = (item: ListingItem): string => {
    return `${item.title} for Sale in ${getLocationString(item.location)}`;
};

export async function generateMetadata({ searchParams, params }: SearchParams & LocalePathParam, parent: ResolvingMetadata): Promise<Metadata> {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = PostedListingsFilterSchema.parse(searchParams);
    const previousDescription = (await parent).description || metadataDesc;
    const previousKeywords = (await parent).keywords || [];
    const previousTwitter = (await parent).twitter || {};
    const previousOpenGraph = (await parent).openGraph || {};

    if (params.locale === BOT_LOCALE) {
        const title = metadataTitle;
        return {
            title,
            description: metadataDesc,
            openGraph: { ...previousOpenGraph, title, description: metadataDesc },
            twitter: { ...previousTwitter, title, description: metadataDesc },
            alternates: getAlternativeLinks("/search"),
        };
    }
    const listings = await api.getPostedListings(params.locale, { PageNumber: Number(page), PageSize: 12, ...parsedSearchParams });
    const title = getSearchTitleMetadata(parsedSearchParams, params.locale, listings.totalCount);
    const newDescription = getSearchDescriptionMetadata(listings);

    const description = newDescription || previousDescription;
    const previousImages = (await parent).openGraph?.images || [];
    const images = listings.items.reduce((newImages, item) => {
        const thumbnailImage = item.vehicle.vehicleImages.find((imageItem) => imageItem.isThumbnail);
        if (thumbnailImage) {
            const seoFriendlyImageName = toSEOFriendlyTitleUrl(item.title, item.location);
            const imageUrl = convertToSEOFriendlyImageURL(thumbnailImage?.name!, seoFriendlyImageName);
            return [...newImages, { url: imageUrl, alt: `${getTitleMetadata(item)} image` }];
        }
        return newImages;
    }, previousImages);

    const country = COUNTRIES[params.locale];

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description, images },
        twitter: { ...previousTwitter, images, title, description },
        alternates: getAlternativeLinks("/search"),
        keywords: [
            ...previousKeywords,
            getLocationString({ city: parsedSearchParams.City!, state: parsedSearchParams.State!, country: country?.[0] }),
        ],
    };
}

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = PostedListingsFilterSchema.parse(searchParams);

    if (params.locale === BOT_LOCALE) {
        return <SearchGrid listings={{ items: [], hasNextPage: false, hasPreviousPage: false, pageNumber: 1, totalCount: 0, totalPages: 1 }} />;
    }

    const listings = await api.getPostedListings(params.locale, { PageNumber: Number(page), PageSize: 12, ...parsedSearchParams });

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/search?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }
    return <SearchGrid listings={listings} />;
}
