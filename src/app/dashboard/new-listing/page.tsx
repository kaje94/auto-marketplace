import { api } from "@/utils/api";
import { CreateListingForm } from "@/app/_components/Forms/Listings/CreateListingForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";

export default async function Page() {
    const [session, features] = await Promise.all([getServerSession(authOptions), api.getFeaturesList()]);

    return <CreateListingForm features={features} userId={session?.user?.id} />;
}
