import { BreadCrumbs, DashboardListingItem, DashboardListHeader } from "@/app/_components";

const DashboardListingsLoading = () => {
    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="All Adverts" />

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
