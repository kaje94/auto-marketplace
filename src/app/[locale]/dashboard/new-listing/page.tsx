import { getSession } from "@auth0/nextjs-auth0/edge";
import { CreateListingForm } from "@/components/Forms/Listings/CreateListingForm";
import { api } from "@/utils/api";

export default async function Page() {
    const session = await getSession();
    const [features, profile] = await Promise.all([api.getFeaturesList(), api.getMyProfileDetails(session?.user?.sub!)]);
    return <CreateListingForm features={features} profile={profile} userId={session?.user?.sub} />;
}
