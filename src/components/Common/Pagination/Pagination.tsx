"use client";
import Link from "next/link";
import { FC } from "react";
import qs, { StringifiableRecord } from "query-string";
import clsx from "clsx";

interface Props {
    pageNumber?: number;
    totalPages?: number;
    basePath?: string;
    searchParams?: StringifiableRecord;
    setNewSearchQuery?: (queryStr: string) => void;
    loading?: boolean;
}

export const Pagination: FC<Props> = ({ totalPages = 0, pageNumber = 1, basePath = "/", searchParams = {}, setNewSearchQuery, loading = false }) => {
    const prevPage = qs.stringify({ ...searchParams, PageNumber: pageNumber - 1 }, { skipNull: true, skipEmptyString: true });
    const nextPage = qs.stringify({ ...searchParams, PageNumber: pageNumber + 1 }, { skipNull: true, skipEmptyString: true });

    return (
        <div className="mt-16 flex justify-center">
            <div className={clsx(totalPages > 1 && "join", loading && "opacity-50")}>
                {pageNumber > 1 && (
                    <>
                        {loading ? (
                            <button className={clsx("join-item btn", loading && "cursor-progress")}>«</button>
                        ) : (
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
                    </>
                )}
                <button className={clsx("join-item btn cursor-default")}>{loading ? "Loading..." : `Page ${pageNumber}`}</button>
                {pageNumber < totalPages && (
                    <>
                        {loading ? (
                            <button className={clsx("join-item btn", loading && "cursor-progress")}>»</button>
                        ) : (
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
                    </>
                )}
            </div>
        </div>
    );
};
