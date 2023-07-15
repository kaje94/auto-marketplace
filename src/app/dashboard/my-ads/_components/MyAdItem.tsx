import { FC } from "react";
import Image from "next/image";
import { TrashIcon, EyeIcon, RefreshIcon } from "@/icons";
import clsx from "clsx";

interface Props {
    title: string;
    price: string;
    description: string;
    tags?: string[];
    state?: "under-review" | "active" | "expired";
}

export const MyAdItem: FC<Props> = ({ title, price, description, tags = [], state = "active" }) => (
    <div className="card mb-3 grid grid-cols-12 gap-4 bg-base-100 p-2 shadow-md zoom-inner-image md:p-4 ">
        <figure className={clsx("relative col-span-12 h-full overflow-hidden rounded-xl md:col-span-3", state === "expired" && "opacity-70")}>
            <Image
                src="https://cdn.britannica.com/93/97093-050-23ACD82B/Prius-Toyota-1997.jpg"
                alt="my-ad"
                className="aspect-video h-full w-full object-cover transition-transform duration-300 ease-linear zoomable-image"
                width={100}
                height={100}
            />
            <div className="badge badge-ghost badge-lg absolute bottom-5 duration-300 ">{price}</div>
        </figure>
        <div className={clsx("col-span-12 flex flex-col md:col-span-8", state === "expired" && "opacity-70")}>
            <div className="text-lg font-semibold text-accent">{title}</div>
            <div className="flex flex-wrap gap-1 py-1 md:py-2">
                {tags.map((tag) => (
                    <div key={tag} className="badge badge-outline lg:badge-md">
                        {tag}
                    </div>
                ))}
            </div>

            <p className="line-clamp-2 flex-1 overflow-hidden text-sm">{description}</p>
            <div className="text-sm italic text-neutral-400">Posted 2 days ago</div>
        </div>
        <div className="col-span-12 flex flex-col items-center p-0 md:col-span-1 md:p-2">
            <div
                className={clsx({
                    "badge badge-lg h-auto text-center capitalize absolute -top-2 -right-1": true,
                    "badge-secondary": state === "active",
                    "badge-ghost": state === "expired",
                    "badge-primary": state === "under-review",
                })}
            >
                {state}
            </div>
            <div className="flex w-full flex-1 flex-col items-end justify-end gap-2">
                {state === "active" && (
                    <div className="w-full md:tooltip" data-tip="View advert">
                        <button className="btn-outline btn-square btn w-full md:w-12">
                            <EyeIcon /> <span className="ml-2 md:hidden">View</span>
                        </button>
                    </div>
                )}
                {state === "expired" && (
                    <div className="w-full md:tooltip" data-tip="Renew expired advert">
                        <button className="btn-outline btn-ghost btn-square btn w-full md:w-12">
                            <RefreshIcon />
                            <span className="ml-2 md:hidden">Renew</span>
                        </button>
                    </div>
                )}
                <div className="w-full md:tooltip" data-tip="Delet advert">
                    <button className="btn-outline btn-error btn-square btn w-full md:w-12">
                        <TrashIcon />
                        <span className="ml-2 md:hidden">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
);
