import { DashboardListHeader } from "@/app/_components";
import { DashboardAllListingsList } from "@/app/_components/DashboardListings/DashboardListingsList";

const DashboardListingsLoading = () => {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllListingsList pageLoading />
        </>
    );
};

export default DashboardListingsLoading;
