import { DashboardListHeader } from "@/components";
import { DashboardAllListingsList } from "@/components/DashboardListings/DashboardListingsList";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllListingsList pageLoading />
        </>
    );
}
