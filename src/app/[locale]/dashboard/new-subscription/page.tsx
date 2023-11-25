import { getSession } from "@auth0/nextjs-auth0/edge";
import { CreateSubscriptionForm } from "@/components/Forms/ListingSubscriptions/CreateSubscriptionForm";
import { api } from "@/utils/api";

export default async function Page() {
    const [session, brands] = await Promise.all([getSession(), api.getVehicleBrands()]);
    return <CreateSubscriptionForm brands={brands} userId={session?.user?.sub} />;
}
