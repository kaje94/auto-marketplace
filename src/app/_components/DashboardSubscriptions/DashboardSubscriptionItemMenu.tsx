"use client";
import { BellIcon, BellOffIcon, EditIcon, MenuIcon, TrashIcon } from "@/icons";
import { ListingSubscriptionItem } from "@/utils/types";
import clsx from "clsx";
import Link from "next/link";
import { FC, ReactNode, useState } from "react";
import { DeleteSubscriptionItemModal } from "@/app/_components/Modals/DeleteSubscriptionItemModal";
import { ToggleSubscriptionActivationModal } from "@/app/_components/Modals/ToggleSubscriptionActivationModal";
import ClickAwayListener from "react-click-away-listener";

interface Props {
    listingSubscriptionItem?: ListingSubscriptionItem;
    basePath?: string;
}

export const DashboardSubscriptionItemMenu: FC<Props> = ({ listingSubscriptionItem = {}, basePath }) => {
    const { id, active } = listingSubscriptionItem as ListingSubscriptionItem;
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [activationModalVisible, setActivationModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <>
            <MenuIcon
                className="cursor-pointer opacity-30 transition-all duration-200 hover:opacity-75 hover:shadow"
                onClick={() => setMenuVisible(true)}
            />
            <ClickAwayListener onClickAway={() => setMenuVisible(false)}>
                <div className={clsx("dropdown-end dropdown", menuVisible && "dropdown-open")}>
                    <ul
                        className="dropdown-content menu rounded-box z-[1] mr-2 mt-6 w-52 rounded-tr-none bg-base-200 p-2 shadow-lg"
                        onClick={() => setMenuVisible(false)}
                    >
                        <MenuItem icon={<EditIcon height={18} />} link={`${basePath}/edit/${id}`} label="Edit" />
                        <MenuItem
                            icon={active ? <BellOffIcon height={18} /> : <BellIcon height={18} />}
                            onClick={() => setActivationModalVisible(true)}
                            label={active ? "Deactivate" : "Activate"}
                        />
                        <MenuItem
                            icon={<TrashIcon height={18} />}
                            onClick={() => setDeleteModalVisible(true)}
                            label="Delete"
                            classNames="text-error hover:!bg-error hover:!text-error-content"
                        />
                    </ul>
                </div>
            </ClickAwayListener>
            <DeleteSubscriptionItemModal
                visible={deleteModalVisible}
                setVisible={setDeleteModalVisible}
                listingSubscriptionItem={listingSubscriptionItem as ListingSubscriptionItem}
            />
            <ToggleSubscriptionActivationModal
                visible={activationModalVisible}
                setVisible={setActivationModalVisible}
                listingSubscriptionItem={listingSubscriptionItem as ListingSubscriptionItem}
            />
        </>
    );
};

// todo: try to re-use components
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
