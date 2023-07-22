import { BreadCrumbs } from "@/app/_components";
import { PreferencesItem } from "./_components";

const Preferences = () => {
    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="Preferences" />
            <div className="grid gap-1 xl:gap-2">
                <PreferencesItem />
            </div>
        </>
    );
};

export default Preferences;
