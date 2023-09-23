"use client";
import { CheckCircleIcon, EditIcon, EyeIcon, EyeOffIcon, MenuIcon, RefreshIcon, TrashIcon } from "@/icons";
import { ListingStatusTypes } from "@/utils/enum";
import { ListingItem } from "@/utils/types";
import clsx from "clsx";
import Link from "next/link";
import { FC, ReactNode, useState } from "react";
import { RenewListingItemModal } from "@/app/_components/Modals/RenewListingItemModal";
import { DeleteListingItemModal } from "@/app/_components/Modals/DeleteListingItemModal";
import { ReviewListingModal } from "@/app/_components/Modals/ReviewListingModal";
import { UnListListingModal } from "@/app/_components/Modals/UnListListingModal";
import ClickAwayListener from "react-click-away-listener";

interface Props {
    listingItem?: ListingItem;
    isAdmin?: boolean;
}

export const DashboardListingItemMenu: FC<Props> = ({ listingItem = {}, isAdmin }) => {
    const { id: listingId, status } = listingItem as ListingItem;
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [renewModalVisible, setRenewModalVisible] = useState(false);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [unListModalVisible, setUnListModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <>
            <MenuIcon
                className="cursor-pointer opacity-30 transition-all duration-200 hover:opacity-75 hover:shadow"
                onClick={(event) => {
                    event.preventDefault();
                    setMenuVisible(true);
                }}
            />
            <ClickAwayListener onClickAway={() => setMenuVisible(false)}>
                <div className={clsx("dropdown-end dropdown", menuVisible && "dropdown-open")}>
                    <ul className="dropdown-content menu rounded-box z-[1] mr-2 mt-6 w-52 rounded-tr-none bg-base-200 p-2 shadow-lg">
                        {status && status === ListingStatusTypes.Posted && (
                            <MenuItem icon={<EyeIcon height={18} />} link={`/search/${listingId}`} label="View Advert" />
                        )}
                        <MenuItem
                            icon={<EditIcon height={18} />}
                            link={`${typeof window !== "undefined" ? window?.location?.pathname : ""}/edit/${listingId}`}
                            label="Edit"
                        />
                        {status &&
                            [ListingStatusTypes.Posted, ListingStatusTypes.Expired, ListingStatusTypes.TemporarilyUnlisted].includes(status) && (
                                <MenuItem icon={<EyeOffIcon height={17} />} onClick={() => setUnListModalVisible(true)} label="Unlist" />
                            )}
                        {status && [ListingStatusTypes.Posted, ListingStatusTypes.Expired].includes(status) && (
                            <MenuItem icon={<RefreshIcon height={17} />} onClick={() => setRenewModalVisible(true)} label="Renew" />
                        )}
                        {isAdmin && status === ListingStatusTypes.UnderReview && (
                            <MenuItem icon={<CheckCircleIcon height={18} />} onClick={() => setReviewModalVisible(true)} label="Review" />
                        )}
                        {isAdmin && (
                            <MenuItem
                                icon={<TrashIcon height={18} />}
                                onClick={() => setDeleteModalVisible(true)}
                                label="Delete"
                                classNames="text-error hover:!bg-error hover:!text-error-content"
                            />
                        )}
                    </ul>
                </div>
            </ClickAwayListener>
            <DeleteListingItemModal
                visible={deleteModalVisible}
                setVisible={setDeleteModalVisible}
                listingItem={listingItem as ListingItem}
                successRedirectPath={typeof window !== "undefined" ? window?.location?.pathname : ""}
            />
            <RenewListingItemModal visible={renewModalVisible} setVisible={setRenewModalVisible} listingItem={listingItem as ListingItem} />
            <ReviewListingModal visible={reviewModalVisible} setVisible={setReviewModalVisible} listingItem={listingItem as ListingItem} />
            <UnListListingModal visible={unListModalVisible} setVisible={setUnListModalVisible} listingItem={listingItem as ListingItem} />
        </>
    );
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
