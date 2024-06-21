import { getSession } from "@auth0/nextjs-auth0";
import { getMyProfileAction } from "@/actions/profileActions";
import { CreateSubscriptionForm } from "@/components/Forms/ListingSubscriptions/CreateSubscriptionForm";

export default async function Page() {
    const session = await getSession();
    const profile = await getMyProfileAction(session?.user?.email!);
    return <CreateSubscriptionForm profile={profile} userEmail={session?.user?.email} />;
}
