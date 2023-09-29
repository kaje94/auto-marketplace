import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { CreateListingForm } from "@/components/Forms/Listings/CreateListingForm";
import { api } from "@/utils/api";

export default async function Page() {
    const [session, features] = await Promise.all([getServerSession(authOptions), api.getFeaturesList()]);

    return <CreateListingForm features={features} userId={session?.user?.id} />;
}
