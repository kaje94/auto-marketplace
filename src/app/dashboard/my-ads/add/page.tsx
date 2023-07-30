import { api } from "@/utils/api";
import { CreateAdvertForm } from "./_components/CreateAdvertForm";

const CreateAdvertPage = async () => {
    const features = await api.getFeatureList();

    return <CreateAdvertForm features={features} />;
};

export default CreateAdvertPage;
