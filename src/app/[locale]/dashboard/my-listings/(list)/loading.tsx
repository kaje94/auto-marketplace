import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardMyListingsList } from "@/components/Dashboard/DashboardListings";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMyListingsList pageLoading />
        </>
    );
}
