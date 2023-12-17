import { BreadCrumbs } from "@/components/Common";
import { ListingForm } from "@/components/Forms/Listings/ListingForm";

export default function Loading() {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[
                    { href: "/", title: "Home" },
                    { title: "Dashboard" },
                    { title: "Manage Adverts", href: "/dashboard/listings" },
                    { title: "Advert Item" },
                ]}
            />
            <ListingForm isLoading />
        </>
    );
}
