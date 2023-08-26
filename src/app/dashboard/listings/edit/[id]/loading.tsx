import { BreadCrumbs } from "@/app/_components";
import { ListingForm } from "@/app/_components/ListingForm";

const ListingFormLoading = () => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[
                    { href: "/", title: "Home" },
                    { title: "Dashboard" },
                    { title: "All Adverts", href: "/dashboard/listings" },
                    { title: "Advert Item" },
                ]}
            />
            <ListingForm isLoading />
        </>
    );
};

export default ListingFormLoading;
