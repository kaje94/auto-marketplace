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
                    { title: "Manage Adverts", href: "/dashboard/listings" },
                    { title: "Advert Item" },
                ]}
            />
            <ListingForm isLoading />
        </>
    );
}
