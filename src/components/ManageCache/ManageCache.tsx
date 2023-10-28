import { RevalidateFeaturedListings } from "./Sections/RevalidateFeaturedListings";
import { RevalidateFeatures } from "./Sections/RevalidateFeatures";
import { RevalidatePostedListings } from "./Sections/RevalidatePostedListings";
import { RevalidateRelatedListings } from "./Sections/RevalidateRelatedListings";
import { RevalidateUserNotifications } from "./Sections/RevalidateUserNotifications";
import { RevalidateVehicleBrands } from "./Sections/RevalidateVehicleBrands";

export const ManageCache = () => {
    return (
        <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <RevalidateFeatures />
            <RevalidateVehicleBrands />
            <RevalidatePostedListings />
            <RevalidateFeaturedListings />
            <RevalidateRelatedListings />
            <RevalidateUserNotifications />
        </div>
    );
};
