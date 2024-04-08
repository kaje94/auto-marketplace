import { RevalidateAllFeaturedListings } from "./Sections/RevalidateAllFeaturedListings";
import { RevalidateAllPostedListings } from "./Sections/RevalidateAllPostedListings";
import { RevalidateCitiesAndStates } from "./Sections/RevalidateCitiesAndStates";
import { RevalidateFeaturedListingsByCountry } from "./Sections/RevalidateFeaturedListingsByCountry";
import { RevalidatePostedListingsByCountry } from "./Sections/RevalidatePostedListingsByCountry";
import { RevalidateRelatedListings } from "./Sections/RevalidateRelatedListings";
import { RevalidateUserNotifications } from "./Sections/RevalidateUserNotifications";
import { RevalidateUserProfileDetails } from "./Sections/RevalidateUserProfileDetails";

export const ManageCache = () => {
    return (
        <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <RevalidateCitiesAndStates />
            <RevalidateAllPostedListings />
            <RevalidatePostedListingsByCountry />
            <RevalidateAllFeaturedListings />
            <RevalidateFeaturedListingsByCountry />
            <RevalidateRelatedListings />
            <RevalidateUserNotifications />
            <RevalidateUserProfileDetails />
        </div>
    );
};
