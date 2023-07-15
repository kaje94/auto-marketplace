import { NotificationItem } from "./_components";

const Notifications = () => {
    return (
        <>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <a>Home</a>
                    </li>
                    <li>
                        <a>Dashboard</a>
                    </li>
                    <li>Notifications</li>
                </ul>
            </div>
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
