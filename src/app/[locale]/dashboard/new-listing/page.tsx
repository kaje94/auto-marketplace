import { getSession } from "@auth0/nextjs-auth0/edge";
import { CreateListingForm } from "@/components/Forms/Listings/CreateListingForm";
import { api } from "@/utils/api";

export default async function Page() {
    const session = await getSession();
    const [features, profile, brands] = await Promise.all([
        api.getFeaturesList(),
        api.getMyProfileDetails(session?.user?.sub!),
        api.getVehicleBrands(),
    ]);
    return <CreateListingForm brands={brands} features={features} profile={profile} userId={session?.user?.sub} />;
}
