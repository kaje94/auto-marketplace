import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
    title: string;
    price: string;
    description: string;
    tags?: string[];
    imageUrl: string;
    imageColor: string;
}

export const ListingItem: FC<Props> = ({ title, price, description, tags = [], imageUrl, imageColor }) => (
    <Link
        href="/listing/item"
        className="card w-full cursor-pointer overflow-hidden bg-base-100 shadow transition-shadow duration-300 zoom-inner-image hover:shadow-lg"
    >
        <figure className="relative">
            <Image
                src={imageUrl}
                alt="Car"
                className={"aspect-video w-full transition-transform duration-300 ease-linear zoomable-image"}
                style={{ background: imageColor }}
                width={100}
                height={100}
            />
            <div className="badge badge-primary badge-lg absolute bottom-5 duration-300 badge-hover-translucent">{price}</div>
        </figure>
        <div className="card-body p-3 lg:p-5 xl:p-7">
            <h2 className="card-title flex">
                <span className="text-md flex-1 truncate text-center">{title}</span>
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
