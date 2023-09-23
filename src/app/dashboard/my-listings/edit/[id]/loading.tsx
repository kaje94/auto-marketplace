import { BreadCrumbs } from "@/app/_components";
import { ListingForm } from "@/app/_components/Forms/Listings/ListingForm";

export default function Loading() {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[
                    { href: "/", title: "Home" },
                    { title: "Dashboard" },
                    { title: "My Adverts", href: "/dashboard/my-listings" },
                    { title: "Advert Item" },
                ]}
            />
            <ListingForm isLoading />
        </>
    );
}
