"use client";
import { DeleteListingItemModal } from "@/app/_components/DeleteListingItemModal";
import { useMounted } from "@/app/_hooks";
import { EditIcon, MenuIcon, TrashIcon } from "@/icons";
import { ListingIdType } from "@/utils/types";
import clsx from "clsx";
import Link from "next/link";
import { FC, ReactNode, useState } from "react";

interface Props {
    listingId?: ListingIdType;
    listingTitle?: string;
}

export const ListingRowItemMenu: FC<Props> = ({ listingId, listingTitle }) => {
    const mounted = useMounted();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    if (mounted) {
        return (
            <div className="dropdown-end dropdown">
                <label tabIndex={0} onClick={(event) => event.preventDefault()}>
                    <MenuIcon className="cursor-pointer opacity-30 transition-all duration-200 hover:opacity-75 hover:shadow" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu rounded-box z-[1] -mr-1 mt-3 w-52 rounded-tr-none bg-base-200 p-2 shadow-lg">
                    <MenuItem icon={<EditIcon height={18} />} link={`/dashboard/listings/edit/${listingId}`} label="Edit" />
                    <MenuItem
                        icon={<TrashIcon height={18} />}
                        onClick={() => setDeleteModalVisible(true)}
                        label="Delete"
                        classNames="text-error hover:!bg-error hover:!text-error-content"
                    />
                </ul>
                <DeleteListingItemModal
                    visible={deleteModalVisible}
                    setVisible={setDeleteModalVisible}
                    listingId={listingId}
                    listingTitle={listingTitle}
                />
            </div>
        );
    }
    return null;
};

const MenuItem = (props: { onClick?: () => void; link?: string; label: string; icon: ReactNode; classNames?: string }) => {
    const { link, label, icon, onClick, classNames } = props;
    return (
        <li>
            {link ? (
                <Link href={link} className="flex">
                    <div className={clsx("flex flex-1 items-center justify-between font-medium", classNames)}>
                        {label}
                        {icon}
                    </div>
                </Link>
            ) : (
                <div
                    onClick={(event) => {
                        event.preventDefault();
                        if (onClick) {
                            onClick();
                        }
                    }}
                    className={clsx("flex flex-1 items-center justify-between font-medium", classNames)}
                >
                    {label}
                    {icon}
                </div>
            )}
        </li>
    );
};
