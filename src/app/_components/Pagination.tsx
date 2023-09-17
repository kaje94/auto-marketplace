"use client";
import Link from "next/link";
import { FC } from "react";
import qs, { StringifiableRecord } from "query-string";
import { SearchParams } from "@/utils/types";

interface Props {
    pageNumber?: number;
    totalPages?: number;
    basePath?: string;
    searchParams?: StringifiableRecord;
    setNewSearchQuery?: (queryStr: string) => void;
}

export const Pagination: FC<Props> = ({ totalPages = 1, pageNumber = 1, basePath = "/", searchParams = {}, setNewSearchQuery }) => {
    if (totalPages === 1) {
        return null;
    }
    const prevPage = qs.stringify({ ...searchParams, PageNumber: pageNumber - 1 }, { skipNull: true, skipEmptyString: true });
    const nextPage = qs.stringify({ ...searchParams, PageNumber: pageNumber + 1 }, { skipNull: true, skipEmptyString: true });

    return (
        <div className="mt-16 flex justify-center">
            <div className="join">
                {pageNumber > 1 && (
                    <Link
                        href={`${basePath}?${prevPage}`}
                        onClick={() => {
                            if (setNewSearchQuery) {
                                setNewSearchQuery(prevPage);
                            }
                        }}
                    >
                        <button className="join-item btn">«</button>
                    </Link>
                )}
                <button className="join-item btn">Page {pageNumber}</button>
                {pageNumber < totalPages && (
                    <Link
                        href={`${basePath}?${nextPage}`}
                        onClick={() => {
                            if (setNewSearchQuery) {
                                setNewSearchQuery(nextPage);
                            }
                        }}
                    >
                        <button className="join-item btn">»</button>
                    </Link>
                )}
            </div>
        </div>
    );
};
