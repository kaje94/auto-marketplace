import { FC } from "react";
import Image from "next/image";
import { RefreshIcon, EditIcon } from "@/icons";
import clsx from "clsx";
import Link from "next/link";
import { unCamelCase } from "@/utils/helpers";
import { DeleteMyAdItem } from "./DeleteMyAdItem";
import { ListingStatusTypes } from "@/utils/enum";

interface Props {
    id?: number;
    title?: string;
    imageUrl?: string;
    blurDataURL?: string;
    price?: string;
    description?: string;
    tags?: string[];
    loading?: boolean;
    status?: ListingStatusTypes;
}
export const MyAdItem: FC<Props> = (props) => {
    const { title, price, description, tags = [], status = ListingStatusTypes.Posted, id, imageUrl, blurDataURL, loading = false } = props;
    const myAddItemContent = (
        <>
            <figure
                className={clsx(
                    "relative col-span-12 h-full overflow-hidden rounded-xl md:col-span-3",
                    status === ListingStatusTypes.Expired && "opacity-70"
                )}
            >
                {loading ? (
                    <div className="aspect-video h-full w-full animate-pulse bg-base-300" />
                ) : (
                    <>
                        <Image
                            src={imageUrl ?? ""}
                            alt={title ?? ""}
                            className="aspect-video h-full w-full object-cover transition-transform duration-300 ease-linear zoomable-image"
                            height={300}
                            width={450}
                            placeholder={blurDataURL ? "blur" : "empty"}
                            blurDataURL={blurDataURL}
                        />
                        <div className="badge badge-ghost badge-lg absolute bottom-5 duration-300 ">{price}</div>
                    </>
                )}
            </figure>

            <div
                className={clsx({
                    "col-span-12 flex flex-col md:col-span-6 xl:col-span-7": true,
                    "opacity-70": status === ListingStatusTypes.Expired,
                })}
            >
                {loading ? <span className="h-6 w-56 bg-base-200" /> : <span className="text-lg font-semibold text-accent">{title}</span>}
                <div className="flex flex-wrap gap-1 py-1 md:py-2">
                    {tags.map((tag) => (
                        <div key={tag} className="badge badge-outline lg:badge-md">
                            {tag}
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="h-12 bg-base-200" />
                ) : (
                    <p className="line-clamp-2 flex-1 overflow-hidden text-sm opacity-80">{description}</p>
                )}
                <div className="mt-2 text-sm italic text-neutral-400">Posted 2 days ago</div>
            </div>
            <div className=" col-span-12 flex h-full  items-center md:col-span-3 xl:col-span-2">
                <div className="rounded-box flex h-min w-full flex-1 flex-wrap items-center justify-center gap-1 border-2 p-2 md:flex-col md:gap-0">
                    <div
                        className={clsx({
                            "badge badge-lg h-auto text-center capitalize p-2 text-sm font-bold md:w-full rounded-box": true,
                            "badge-secondary": status === ListingStatusTypes.Posted && !loading,
                            "badge-ghost": status === ListingStatusTypes.Expired,
                            "badge-primary": status === ListingStatusTypes.UnderReview,
                        })}
                    >
                        {loading ? "Loading..." : unCamelCase(status)}
                    </div>
                    <div className="divider my-0" />
                    {status === ListingStatusTypes.Posted && (
                        <>
                            <button className="btn-ghost btn-sm btn md:w-full" disabled={loading}>
                                <EditIcon /> <span className="ml-2">Edit</span>
                            </button>
                            <div className="divider my-0" />
                        </>
                    )}
                    {status === ListingStatusTypes.Expired && (
                        <>
                            <button className="btn-ghost btn-sm btn md:w-full">
                                <RefreshIcon />
                                <span className="ml-2">Renew</span>
                            </button>
                            <div className="divider my-0" />
                        </>
                    )}
                    <DeleteMyAdItem loading={loading} listingId={id} />
                </div>
            </div>
        </>
    );

    if (loading) {
        <div className="card mb-3 grid animate-ping grid-cols-12 gap-4 bg-base-100 p-2 shadow transition-shadow zoom-inner-image hover:shadow-md md:p-4">
            {myAddItemContent}
        </div>;
    }

    return (
        <Link
            className="card mb-3 grid cursor-pointer grid-cols-12 gap-4 bg-base-100 p-2 shadow transition-shadow zoom-inner-image hover:shadow-md md:p-4"
            href={`/listing/${id}`}
        >
            {myAddItemContent}
        </Link>
    );
};
