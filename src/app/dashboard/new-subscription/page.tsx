import { CreateSubscriptionForm } from "../../_components/Forms/ListingSubscriptions/CreateSubscriptionForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";

const CreateSubscriptionPage = async () => {
    const session = await getServerSession(authOptions);

    return <CreateSubscriptionForm userId={session?.user?.id} />;
};

export default CreateSubscriptionPage;
