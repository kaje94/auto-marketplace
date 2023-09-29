import { CreateSubscriptionForm } from "@/app/_components/Forms/ListingSubscriptions/CreateSubscriptionForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";

export default async function Page() {
    const session = await getServerSession(authOptions);

    return <CreateSubscriptionForm userId={session?.user?.id} />;
}
