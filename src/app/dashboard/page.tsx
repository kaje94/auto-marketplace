// import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

const Dashboard = () => {
    return redirect("/dashboard/profile");
};

export default Dashboard;
