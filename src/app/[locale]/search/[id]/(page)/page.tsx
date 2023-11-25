import { getSession } from "@auth0/nextjs-auth0/edge";
import { BreadCrumbs, ErrorComponent } from "@/components/Common";
import { ListingDetails, RelatedListingsCarousel } from "@/components/ListingDetails";
import { ListingDetailsCountrySelectBtn } from "@/components/ListingDetails/CountrySelectButton";
import { api } from "@/utils/api";
import { COUNTRIES } from "@/utils/countries";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdPathParam, LocalePathParam } from "@/utils/types";

export default async function Page({ params }: ListingIdPathParam & LocalePathParam) {
    const [session, itemDetails] = await Promise.all([getSession(), transformListingResponse(await api.getPostedListingItem(params.id))]);
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
