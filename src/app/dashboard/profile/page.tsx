import { BreadCrumbs } from "@/app/_components";

const ProfilePage = () => {
    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="Profile" />
        </>
    );
};

export default ProfilePage;
