import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { CreateSubscriptionForm } from "@/components/Forms/ListingSubscriptions/CreateSubscriptionForm";

export default async function Page() {
    const session = await getServerSession(authOptions);

    return <CreateSubscriptionForm userId={session?.user?.id} />;
}
