import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import qs from "query-string";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { getPublicListingsAction } from "@/actions/publicListingActions";
import { SearchGrid } from "@/components/Listings/PostedListingsSearchGrid";
import { BOT_LOCALE } from "@/utils/constants";
import { COUNTRIES, getAlternativeLinks } from "@/utils/countries";
import { getFormattedCurrency, getListingTitleFromListing, getLocationString, getLocationUserProfile, unCamelCase } from "@/utils/helpers";
import { PublicListingsFilterSchema } from "@/utils/schemas";
import { LocalePathParam, PublicListingsFilterReq, SearchParams } from "@/utils/types";

const metadataDesc =
    "Refine your search criteria and discover the perfect automotive match. Targabay – Simplifying the search process for a seamless and personalized buying experience";
const metadataTitle = "Targabay - Explore and Discover Listings";

const getSearchTitleMetadata = (filters: PublicListingsFilterReq, locale: string, resultsCount: number, pageNumber = 1): string => {
    let title = metadataTitle;
    const items: string[] = [];
    const country = COUNTRIES[locale];

    if (filters.query) {
        items.push(filters.query);
    }
    if (filters.condition) {
        items.push(`Condition:${filters.condition}`);
    }
    if (filters.fuelType) {
        items.push(`Fuel-Type:${filters.fuelType}`);
    }
    if (filters.vehicleType) {
        items.push(unCamelCase(filters.vehicleType));
    }
    if (filters.transmissionType) {
        items.push(unCamelCase(filters.transmissionType));
    }

    if (country) {
        if (filters.maxPrice && filters.minPrice) {
            items.push(
                `Price-Range:${getFormattedCurrency(filters.minPrice, country?.[1]!)}-${getFormattedCurrency(filters.maxPrice, country?.[1]!)}`,
            );
        } else if (filters.maxPrice) {
            items.push(`Price-Upto:${getFormattedCurrency(filters.maxPrice, country?.[1]!)}`);
        } else if (filters.minPrice) {
            items.push(`Price-From:${getFormattedCurrency(filters.minPrice, country?.[1]!)}`);
        }
    }

    if (filters.yomStartDate && filters.yomEndDate) {
        items.push(`Manufactured-Between:${filters.yomStartDate}-${filters.yomEndDate}`);
    } else if (filters.yomStartDate) {
        items.push(`Manufactured-From:${filters.yomStartDate}`);
    } else if (filters.yomEndDate) {
        items.push(`Manufactured-Before:${filters.yomEndDate}`);
    }

    if (filters.startCreatedDate && filters.endCreatedDate) {
        items.push(`Created-Between:${filters.startCreatedDate}-${filters.endCreatedDate}`);
    } else if (filters.startCreatedDate) {
        items.push(`Created-From:${filters.startCreatedDate}`);
    } else if (filters.endCreatedDate) {
        items.push(`Created-Before:${filters.endCreatedDate}`);
    }
    title = `${title}${items.length > 0 ? ` for ${items.join("|")}` : ""} in ${getLocationString({
        city: filters.city!,
        state: filters.state!,
        country: country?.[0] ?? "",
    })}`;
    title = `${title} ${pageNumber > 1 ? ` Page-${pageNumber}` : ""}`;
    title = `${title} ${resultsCount > 0 ? ` (${resultsCount} found)` : ` (No listings found)`}`;
    return title;
};

const getSearchDescriptionMetadata = (listings: ListingItem[] = []): string => {
    return listings.length > 0 ? `Search results: ${listings.map((item) => getListingTitleFromListing(item.data!)).join(",")}` : "";
};

const getTitleMetadata = (item: ListingItem): string => {
    const title = getListingTitleFromListing(item.data!);
    const location = getLocationUserProfile(item.user!);
    return `${title} for Sale in ${getLocationString(location)}`;
};

export async function generateMetadata({ searchParams, params }: SearchParams & LocalePathParam, parent: ResolvingMetadata): Promise<Metadata> {
    const page = searchParams["PageNumber"] ?? "1";
    const publicFilters = PublicListingsFilterSchema.parse(searchParams);

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
    const listings = await getPublicListingsAction({
        page: { pageNumber: Number(page), pageSize: 12 },
        query: publicFilters.query,
        filters: {
            publicFilters: {
                ...publicFilters,
                state: publicFilters.state!,
                city: publicFilters.city!,
                countryCode: params.locale,
                maxPrice: typeof publicFilters.maxPrice == "string" ? parseFloat(publicFilters.maxPrice) : 0,
                minPrice: typeof publicFilters.minPrice == "string" ? parseFloat(publicFilters.minPrice) : 0,
            },
        },
    });
    const title = getSearchTitleMetadata(publicFilters, params.locale, listings?.page?.totalCount!);
    const newDescription = getSearchDescriptionMetadata(listings.items);

    const description = newDescription || previousDescription;
    const previousImages = (await parent).openGraph?.images || [];
    const images =
        listings?.items?.reduce((newImages, item) => {
            const thumbnailImage = item.data?.vehicleImages.find((imageItem) => imageItem.isThumbnail);
            if (thumbnailImage?.url) {
                return [...newImages, { url: thumbnailImage.url, alt: `${getTitleMetadata(item)} image` }];
            }
            return newImages;
        }, previousImages) ?? [];

    const country = COUNTRIES[params.locale];

    return {
        title,
        description,
        openGraph: { ...previousOpenGraph, title, description, images },
        twitter: { ...previousTwitter, images, title, description },
        alternates: getAlternativeLinks("/search"),
        keywords: [...previousKeywords, getLocationString({ city: publicFilters.city!, state: publicFilters.state!, country: country?.[0] })],
    };
}

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const publicFilters = PublicListingsFilterSchema.parse(searchParams);

    if (params.locale === BOT_LOCALE) {
        return <SearchGrid listings={[]} />;
    }

    const listingsRes = await getPublicListingsAction({
        page: { pageNumber: Number(page), pageSize: 12 },
        query: publicFilters.query,
        filters: {
            publicFilters: {
                ...publicFilters,
                state: publicFilters.state!,
                city: publicFilters.city!,
                countryCode: params.locale,
                maxPrice: typeof publicFilters.maxPrice == "string" ? parseFloat(publicFilters.maxPrice) : 0,
                minPrice: typeof publicFilters.minPrice == "string" ? parseFloat(publicFilters.minPrice) : 0,
            },
        },
    });

    if (listingsRes.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/search?${qs.stringify({ ...publicFilters, PageNumber: 1 }, { skipEmptyString: true })}`);
    }
    return <SearchGrid currentPageNumber={Number(page) || 1} listings={listingsRes.items} paginatedResponse={listingsRes.page} />;
}
