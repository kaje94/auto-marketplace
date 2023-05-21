import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  price: string;
  description: string;
  tags?: string[];
}

export const ListingItem: FC<Props> = ({
  title,
  price,
  description,
  tags = [],
}) => (
  <Link
    href="/listing/item"
    className="card w-full cursor-pointer bg-base-100 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 zoom-inner-image"
  >
    <figure className="relative">
      <Image
        src="https://cdn.britannica.com/93/97093-050-23ACD82B/Prius-Toyota-1997.jpg"
        alt="Car"
        className="transition-transform ease-linear duration-300 zoomable-image w-full aspect-video"
        width={100}
        height={100}
        // fill={true}
      />
      <div className="badge badge-primary badge-lg absolute bottom-5 duration-300">
        {price}
      </div>
    </figure>
    <div className="card-body p-3 lg:p-5 xl:p-7">
      <h2 className="card-title flex">
        <span className="flex-1 truncate text-center text-md">{title}</span>
      </h2>
      <p className="line-clamp-2 overflow-hidden text-center text-sm">
        {description}
      </p>
      <div className="card-actions justify-center mt-1 ">
        {tags.map((tag) => (
          <div key={tag} className="badge badge-outline badge-sm lg:badge-md ">
            {tag}
          </div>
        ))}
      </div>
    </div>
  </Link>
);
