import { api } from "@/utils/api";
import { CreateListingForm } from "./_components/CreateListingForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";

const CreateListingPage = async () => {
    const session = await getServerSession(authOptions);
    const features = await api.getFeaturesList();

    return <CreateListingForm features={features} userId={session?.user?.id} />;
};

export default CreateListingPage;
