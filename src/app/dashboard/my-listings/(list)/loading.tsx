import { DashboardListingItem, DashboardListHeader } from "@/app/_components";

const DashboardListingsLoading = () => {
    return (
        <>
            <DashboardListHeader loading />

            <div className="grid gap-1 xl:gap-2">
                {new Array(5).fill("").map((_, i) => (
                    <DashboardListingItem key={i} loading={true} />
                ))}
            </div>
        </>
    );
};

export default DashboardListingsLoading;
