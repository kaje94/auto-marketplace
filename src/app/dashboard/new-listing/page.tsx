import { getSession } from "@auth0/nextjs-auth0";
import { CreateListingForm } from "@/components/Forms/Listings/CreateListingForm";
import { api } from "@/utils/api";

export default async function Page() {
    const [session, features] = await Promise.all([getSession(), api.getFeaturesList()]);
    return <CreateListingForm features={features} userId={session?.user?.sub} />;
}
