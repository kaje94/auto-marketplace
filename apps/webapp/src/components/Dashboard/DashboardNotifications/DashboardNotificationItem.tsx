import { clsx } from "clsx";
import Link from "next/link";
import { FC } from "react";
import { NotificationItem } from "targabay-protos/gen/ts/dist/types/notifications_pb";
import { NotificationIcon } from "@/icons";
import { getRandomItem, timeAgo } from "@/utils/helpers";

interface Props {
    /** Whether or not to show the placeholder data */
    loading?: boolean;
    /** Details of a particular notification item */
    notificationItem?: NotificationItem;
}

/** To represent an individual notification item within the notification list */
export const DashboardNotificationItem: FC<Props> = (props) => {
    const { notificationItem = {}, loading } = props;
    const { title, body, createdAt, isShown, redirectPath } = notificationItem as NotificationItem;

    const notificationItemContent = (
        <div
            className={clsx(
                "flex flex-col gap-0.5 bg-opacity-10 p-3 transition-colors duration-1000 md:p-4",
                !loading && !isShown ? "bg-secondary" : "bg-base-100",
            )}
        >
            <div className="flex flex-row items-start gap-2 ">
                {!loading && <NotificationIcon className="mt-[6px] h-4 w-4 text-neutral" />}

                {loading ? (
                    <div className={clsx("h-6 bg-base-200", getRandomItem(["w-48", "w-44", "w-52", "w-60"]))} />
                ) : (
                    <div className="flex flex-1 gap-2">
                        <div className="flex flex-1 flex-wrap items-center gap-1 md:gap-2 xl:gap-4">
                            <span className="text-xl font-semibold text-base-content">{title}</span>
                            {!isShown && (
                                <span
                                    className={clsx({
                                        "badge badge-lg badge-secondary": true,
                                    })}
                                >
                                    New
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1">
                {loading ? (
                    <div className={clsx("w-full bg-base-200", getRandomItem(["h-10", "h-12", "h-14"]))} />
                ) : (
                    <p className="overflow-hidden opacity-80">{body}</p>
                )}
            </div>

            <div className="mt-2">
                {loading ? (
                    <div className="h-4 w-32 bg-base-200" />
                ) : (
                    <div className="text-xs text-neutral-400">Created {timeAgo(new Date(createdAt))}</div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return <div className="card mb-3 h-fit overflow-hidden bg-base-100 shadow">{notificationItemContent}</div>;
    }

    if (redirectPath) {
        return (
            <Link className="card mb-3 h-fit cursor-pointer overflow-hidden bg-base-100 shadow transition-all hover:shadow-md" href={redirectPath}>
                {notificationItemContent}
            </Link>
        );
    }

    return <div className="card mb-3 h-fit overflow-hidden bg-base-100 shadow">{notificationItemContent}</div>;
};
