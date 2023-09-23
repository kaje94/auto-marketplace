import { DashboardListHeader } from "@/app/_components";
import { DashboardMyListingsList } from "@/app/_components/DashboardListings/DashboardListingsList";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMyListingsList pageLoading />
        </>
    );
}
