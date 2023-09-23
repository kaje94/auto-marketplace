import { DashboardListHeader } from "@/app/_components";
import { DashboardMyListingsList } from "@/app/_components/DashboardListings/DashboardListingsList";

const DashboardListingsLoading = () => {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMyListingsList pageLoading />
        </>
    );
};

export default DashboardListingsLoading;
