import { BreadCrumbs } from "@/app/_components";
import { ListingRowItem } from "./_components";

const DashboardListingsLoading = () => {
    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="My Adverts" />
            <div className="grid gap-1 xl:gap-2">
                {new Array(5).fill("").map((_, i) => (
                    <ListingRowItem key={i} loading={true} />
                ))}
            </div>
        </>
    );
};

export default DashboardListingsLoading;
