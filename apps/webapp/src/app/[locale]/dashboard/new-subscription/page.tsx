import { getSession } from "@auth0/nextjs-auth0";
import { getMyProfileAction } from "@/actions/profileActions";
import { canCreateSubscriptionAction } from "@/actions/userSubscriptionActions";
import { CreateSubscriptionForm } from "@/components/Forms/ListingSubscriptions/CreateSubscriptionForm";

export default async function Page() {
    const session = await getSession();
    const [profile, canCreate] = await Promise.all([getMyProfileAction(session?.user?.email!), canCreateSubscriptionAction(session?.user?.email!)]);
    return <CreateSubscriptionForm canCreate={canCreate} profile={profile} userEmail={session?.user?.email} />;
}
