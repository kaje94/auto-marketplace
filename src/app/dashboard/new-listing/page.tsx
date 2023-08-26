import { api } from "@/utils/api";
import { CreateListingForm } from "./_components/CreateListingForm";

const CreateListingPage = async () => {
    const features = await api.getFeaturesList();

    return <CreateListingForm features={features} />;
};

export default CreateListingPage;
