"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
    isAdmin?: boolean;
    listingId?: string;
}

export const EditButton = ({ listingId, isAdmin }: Props) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);

    return (
        <>
            {loaded && (
                <Link href={isAdmin ? `/dashboard/listings/edit/${listingId}` : `/dashboard/my-listings/edit/${listingId}`}>
                    <button className="btn btn-ghost btn-sm">Edit</button>
                </Link>
            )}
        </>
    );
};
