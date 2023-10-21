import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardMyListingsList } from "@/components/DashboardListings";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMyListingsList pageLoading />
        </>
    );
}
