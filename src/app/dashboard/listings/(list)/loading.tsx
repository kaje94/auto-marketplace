import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardAllListingsList } from "@/components/DashboardListings";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllListingsList pageLoading />
        </>
    );
}
