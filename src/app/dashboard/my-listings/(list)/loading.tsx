import { DashboardListHeader } from "@/components";
import { DashboardMyListingsList } from "@/components/DashboardListings/DashboardListingsList";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMyListingsList pageLoading />
        </>
    );
}
