import { getSession } from "@auth0/nextjs-auth0";
import { Metadata, ResolvingMetadata } from "next";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { getPublicListingItemAction, incrementViewsAction } from "@/actions/publicListingActions";
import { BreadCrumbs, ErrorComponent } from "@/components/Common";
import { ListingDetails, RelatedListingsCarousel } from "@/components/Listings/ListingDetails";
import { ListingDetailsCountrySelectBtn } from "@/components/Listings/ListingDetails/CountrySelectButton";
import { COUNTRIES } from "@/utils/countries";
import { ListingStatusTypes } from "@/utils/enum";
import { getFormattedCurrency, getListingTitleFromListing, getLocationString, getLocationUserProfile, unCamelCase } from "@/utils/helpers";
import { ListingIdPathParam, LocalePathParam } from "@/utils/types";

const getListingDescriptionMetadata = (item: ListingItem): string => {
    const title = getListingTitleFromListing(item.data!);
    const location = getLocationUserProfile(item.user!);
    const country = COUNTRIES[location?.country];

    const desc = `Explore the ${title} listing on Targabay. Located in ${getLocationString(location)}, this ${unCamelCase(
        item?.data?.condition!,
    )} vehicle is priced at ${getFormattedCurrency(item.data?.price, country?.[2]!)} (${
        country?.[1]
    }). With a manufacturing year of ${item?.data?.yearOfManufacture}${
        item?.data?.yearOfRegistration ? ` and registration in ${item?.data?.yearOfRegistration}` : ""
    }, it boasts a ${unCamelCase(item?.data?.transmissionType)} transmission, ${unCamelCase(item?.data?.fuelType)} fuel type, and a ${
        item?.data?.engineCapacity
    } CC engine capacity.${
        item?.data?.features?.length! > 0 ? ` The vehicle comes with features such as ${item?.data?.features?.join(",")}.` : ""
    } Discover detailed specifications and pricing for a seamless buying experience. Targabay – Your trusted online marketplace for cars, bikes, and more.`;

    return desc;
};

const getTitleMetadata = (item: ListingItem): string => {
    const title = getListingTitleFromListing(item.data!);
    const location = getLocationUserProfile(item.user!);

    return `${title} for Sale in ${getLocationString(location)}`;
};

export async function generateMetadata({ params }: ListingIdPathParam, parent: ResolvingMetadata): Promise<Metadata> {
    const itemDetails = await getPublicListingItemAction(params.id);
    if (itemDetails.status == ListingStatusTypes.Posted) {
        const image = itemDetails?.data?.vehicleImages?.find((item) => item.isThumbnail === true) ?? itemDetails?.data?.vehicleImages[0];
        const listingTitle = getListingTitleFromListing(itemDetails.data!);
        const location = getLocationUserProfile(itemDetails.user!);
        const title = `Targabay - ${getTitleMetadata(itemDetails)}`;
        const description = getListingDescriptionMetadata(itemDetails);
        const previousKeywords = (await parent).keywords || [];
        const previousTwitter = (await parent).twitter || {};
        const previousOpenGraph = (await parent).openGraph || {};
        const images = [{ url: image?.url ?? "", alt: `${getTitleMetadata(itemDetails)} image` }];
        return {
            title,
            description,
            openGraph: { ...previousOpenGraph, title: getTitleMetadata(itemDetails), description, images },
            twitter: { ...previousTwitter, images, title: getTitleMetadata(itemDetails), description },
            alternates: {},
            keywords: [...previousKeywords, listingTitle, itemDetails?.data?.brand!, itemDetails?.data?.model!, getLocationString(location)],
        };
    }
    return { title: `Targabay - Listing advert is unavailable`, alternates: {} };
}

export default async function Page({ params }: ListingIdPathParam & LocalePathParam) {
    const [session, itemDetails] = await Promise.all([getSession(), getPublicListingItemAction(params.id)]);
    incrementViewsAction(params.id);
    const location = getLocationUserProfile(itemDetails.user!);
    const listingCountry = COUNTRIES[location?.country];
    const userCountry = COUNTRIES[params.locale];
    const listingTitle = getListingTitleFromListing(itemDetails.data!);

    let content = null;
    if (params.locale !== location?.country) {
        content = (
            <ErrorComponent
                subTitle={`This advert is only available in ${listingCountry?.[0]}. Please switch to country ${listingCountry?.[0]} in order to view this listing advert`}
                title={`Listing unavailable in ${userCountry?.[0]}`}
            >
                <ListingDetailsCountrySelectBtn />
            </ErrorComponent>
        );
    } else if (itemDetails.status !== ListingStatusTypes.Posted) {
        content = (
            <ErrorComponent subTitle={`This listing advert has been marked as '${unCamelCase(itemDetails.status)}'`} title={`Listing Unavailable`} />
        );
    } else {
        content = <ListingDetails itemDetails={itemDetails} loggedInUser={{ email: session?.user?.email, isAdmin: session?.user?.isAdmin }} />;
    }

    return (
        <>
            <BreadCrumbs
                currentPageTitle={itemDetails.status === ListingStatusTypes.Posted ? listingTitle : "Listing Unavailable"}
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
