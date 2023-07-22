import { BreadCrumbs } from "@/app/_components";
import { NotificationItem } from "./_components";

const Notifications = () => {
    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="Notifications" />
            <div className="grid gap-1 xl:gap-2">
                <NotificationItem
                    title="Advert under review"
                    description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
whose shoes does he choose If a dog chews shoes whose shoes does he
choose If a dog chews shoes whose shoes does he choose?"
                    newNotification
                />
                <NotificationItem
                    title="Advert under review"
                    description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
whose shoes does he choose If a dog chews shoes whose shoes does he
choose If a dog chews shoes whose shoes does he choose?"
                    newNotification={false}
                />
            </div>
        </>
    );
};

export default Notifications;
