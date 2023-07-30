import { api } from "@/utils/api";
import { CreateAdvertForm } from "./_components/CreateAdvertForm";

const CreateAdvertPage = async () => {
    const features = await api.getFeatureList();
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    return <CreateAdvertForm features={features} />;
};

export default CreateAdvertPage;
