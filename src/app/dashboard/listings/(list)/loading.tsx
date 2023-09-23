import { DashboardListHeader } from "@/app/_components";
import { DashboardAllListingsList } from "@/app/_components/DashboardListings/DashboardListingsList";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllListingsList pageLoading />
        </>
    );
}
