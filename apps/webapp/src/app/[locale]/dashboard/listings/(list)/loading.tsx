import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardAllListingsList } from "@/components/Dashboard/DashboardListings";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllListingsList pageLoading />
        </>
    );
}
