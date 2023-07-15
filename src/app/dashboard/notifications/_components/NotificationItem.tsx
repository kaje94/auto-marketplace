import { FC } from "react";
import { NotificationIcon } from "@/icons";

interface Props {
    title: string;
    description: string;
    newNotification: boolean;
}

export const NotificationItem: FC<Props> = ({ title, description, newNotification }) => (
    <div className="card relative mb-2 bg-base-100 p-2 shadow-md md:p-5">
        {newNotification && <div className="badge-primary badge badge-md absolute -right-2 -top-2 "></div>}
        <div className="flex flex-row items-center gap-2 ">
            <NotificationIcon className="h-5 w-5 text-accent" />
            <h4 className="text-lg font-medium text-accent">{title} dask dlaskd lsa dlas dlak sdlas dlajs dlaj dals d</h4>
        </div>
        <p>{description}</p> <p className="text-right text-xs font-thin">2 days ago</p>
    </div>
);
