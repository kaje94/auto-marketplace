import { getSession } from "@auth0/nextjs-auth0/edge";
import { CreateSubscriptionForm } from "@/components/Forms/ListingSubscriptions/CreateSubscriptionForm";

export default async function Page() {
    const session = await getSession();
    return <CreateSubscriptionForm userId={session?.user?.sub} />;
}