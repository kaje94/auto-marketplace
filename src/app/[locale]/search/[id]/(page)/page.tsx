import { getSession } from "@auth0/nextjs-auth0/edge";
import { Metadata, ResolvingMetadata } from "next";
import { BreadCrumbs, ErrorComponent } from "@/components/Common";
import { ListingDetails, RelatedListingsCarousel } from "@/components/Listings/ListingDetails";
import { ListingDetailsCountrySelectBtn } from "@/components/Listings/ListingDetails/CountrySelectButton";
import { api } from "@/utils/api";
import { COUNTRIES } from "@/utils/countries";
import { getFormattedCurrency, getLocationString, toSEOFriendlyTitleUrl, unCamelCase } from "@/utils/helpers";
import { convertToSEOFriendlyImageURL } from "@/utils/imageUtils";
import { ListingIdPathParam, ListingItem, LocalePathParam } from "@/utils/types";

const getListingDescriptionMetadata = (item: ListingItem): string => {
    const desc = `Explore the ${item.title} listing on Targabay. Located in ${getLocationString(item.location)}, this ${unCamelCase(
        item.vehicle.condition,
    )} vehicle is priced at ${getFormattedCurrency(item.price.amount, item.price.currencySymbol)} (${
        item.price.currencyCode
    }). With a manufacturing year of ${item.vehicle.yearOfManufacture}${
        item.vehicle.yearOfRegistration ? ` and registration in ${item.vehicle.yearOfRegistration}` : ""
    }, it boasts a ${unCamelCase(item.vehicle.transmission)} transmission, ${unCamelCase(item.vehicle.fuelType)} fuel type, and a ${
        item.vehicle.engineCapacity
    } CC engine capacity.${
        item.vehicle.features?.length > 0 ? ` The vehicle comes with features such as ${item.vehicle.features.join(",")}.` : ""
    } Discover detailed specifications and pricing for a seamless buying experience. Targabay – Your trusted online marketplace for cars, bikes, and more.`;

    return desc;
};

const getTitleMetadata = (item: ListingItem): string => {
    return `${item.title} for Sale in ${getLocationString(item.location)}`;
};

export async function generateMetadata({ params }: ListingIdPathParam, parent: ResolvingMetadata): Promise<Metadata> {
    const itemDetails = await api.getPostedListingItem(params.id);
    if (itemDetails.title) {
        const image = itemDetails?.vehicle?.vehicleImages?.find((item) => item.isThumbnail === true);
        const seoFriendlyImageName = toSEOFriendlyTitleUrl(itemDetails.title, itemDetails.location);
        const imageUrl = convertToSEOFriendlyImageURL(image?.name!, seoFriendlyImageName);
        const title = `Targabay - ${getTitleMetadata(itemDetails)}`;
        const description = getListingDescriptionMetadata(itemDetails);
        const previousKeywords = (await parent).keywords || [];
        const previousImages = (await parent).openGraph?.images || [];
        const previousTwitter = (await parent).twitter || {};
        const previousOpenGraph = (await parent).openGraph || {};
        const images = [...previousImages, { url: imageUrl, alt: `${getTitleMetadata(itemDetails)} image` }];
        return {
            title,
            description,
            openGraph: { ...previousOpenGraph, title: getTitleMetadata(itemDetails), description, images },
            twitter: { ...previousTwitter, images, title: getTitleMetadata(itemDetails), description },
            alternates: {},
            keywords: [
                ...previousKeywords,
                itemDetails.title,
                itemDetails.vehicle.brand,
                itemDetails.vehicle.model,
                getLocationString(itemDetails.location),
            ],
        };
    }
    return { title: `Targabay - Listing advert is unavailable`, alternates: {} };
}

export default async function Page({ params }: ListingIdPathParam & LocalePathParam) {
    const [session, itemDetails] = await Promise.all([getSession(), api.getPostedListingItem(params.id)]);
    api.incrementViews(params.id);

    const listingCountry = COUNTRIES[itemDetails.location?.country];
    const userCountry = COUNTRIES[params.locale];

    let content = null;
    if (params.locale !== itemDetails.location?.country) {
        content = (
            <ErrorComponent
                subTitle={`This advert is only available in ${listingCountry?.[0]}. Please switch to country ${listingCountry?.[0]} in order to view this listing advert`}
                title={`Item unavailable in ${userCountry?.[0]}`}
            >
                <ListingDetailsCountrySelectBtn />
            </ErrorComponent>
        );
    } else {
        content = (
            <ListingDetails
                itemDetails={itemDetails}
                loggedInUser={{ email: session?.user?.email, id: session?.user?.sub, isAdmin: session?.user?.isAdmin }}
            />
        );
    }

    return (
        <>
            <BreadCrumbs
                currentPageTitle={itemDetails.title}
                links={[
                    { href: "/", title: "Home" },
                    { href: "/search", title: "Search" },
                ]}
            />
            {content}
            <div className="divider mt-16">Related Adverts</div>
            <RelatedListingsCarousel itemDetails={itemDetails} />
        </>
    );
}
