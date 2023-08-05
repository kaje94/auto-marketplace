import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
    id: number;
    title: string;
    price: string;
    description: string;
    tags?: string[];
    imageUrl: string;
    imageAlt: string;
    blurDataURL?: string;
}

export const ListingItem: FC<Props> = ({ id, title, price, description, tags = [], imageUrl, blurDataURL, imageAlt }) => (
    <Link
        href={`/listing/${id}`}
        className="card w-full cursor-pointer overflow-hidden bg-base-100 shadow transition-shadow duration-300 zoom-inner-image hover:shadow-lg"
    >
        <figure className="relative">
            <Image
                src={imageUrl}
                alt={imageAlt}
                className={"aspect-video w-full bg-base-200 transition-transform duration-300 ease-linear zoomable-image"}
                height={300}
                width={450}
                placeholder={blurDataURL ? "blur" : "empty"}
                blurDataURL={blurDataURL}
            />
            <div className="badge badge-primary badge-lg absolute bottom-5 duration-300 badge-hover-translucent">{price}</div>
        </figure>
        <div className="card-body p-3 lg:p-5 xl:p-7">
            <h2 className="card-title flex">
                <span className="flex-1 truncate text-center text-base">{title}</span>
            </h2>
            <p className="line-clamp-2 overflow-hidden text-center text-sm">{description}</p>
            <div className="card-actions mt-1 justify-center ">
                {tags.map((tag) => (
                    <div key={tag} className="badge badge-outline badge-sm lg:badge-md ">
                        {tag}
                    </div>
                ))}
            </div>
        </div>
    </Link>
);
