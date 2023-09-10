import { DashboardListHeader } from "@/app/_components";
import { DashboardSubscriptionItem } from "@/app/_components/DashboardSubscriptionItem";

const AllSubscriptionsLoading = () => {
    return (
        <>
            <DashboardListHeader loading />

            <div className="grid gap-1 xl:gap-2">
                {new Array(5).fill("").map((_, i) => (
                    <DashboardSubscriptionItem key={i} loading={true} />
                ))}
            </div>
        </>
    );
};

export default AllSubscriptionsLoading;
