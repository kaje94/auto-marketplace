"use client";
import { CheckCircleIcon, EditIcon, EyeIcon, EyeOffIcon, RefreshIcon, TrashIcon } from "@/icons";
import { ListingStatusTypes } from "@/utils/enum";
import { ListingItem } from "@/utils/types";
import { FC, useState } from "react";
import { RenewListingItemModal } from "@/components/Modals/RenewListingItemModal";
import { DeleteListingItemModal } from "@/components/Modals/DeleteListingItemModal";
import { ReviewListingModal } from "@/components/Modals/ReviewListingModal";
import { UnListListingModal } from "@/components/Modals/UnListListingModal";
import { ContextMenu, ContextMenuItemProp } from "@/components/Common";

interface Props {
    listingItem?: ListingItem;
    isAdmin?: boolean;
    basePath?: string;
}

export const DashboardListingItemMenu: FC<Props> = ({ listingItem = {}, isAdmin, basePath }) => {
    const { id: listingId, status } = listingItem as ListingItem;
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [renewModalVisible, setRenewModalVisible] = useState(false);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [unListModalVisible, setUnListModalVisible] = useState(false);

    const menuItems: ContextMenuItemProp[] = [];

    if (status && status === ListingStatusTypes.Posted) {
        menuItems.push({
            icon: <EyeIcon height={18} />,
            link: `/search/${listingId}`,
            label: "View Advert",
        });
    }
    menuItems.push({
        icon: <EditIcon height={18} />,
        link: `${basePath}/edit/${listingId}`,
        label: "Edit",
    });
    if (status && [ListingStatusTypes.Posted, ListingStatusTypes.Expired, ListingStatusTypes.TemporarilyUnlisted].includes(status)) {
        menuItems.push({
            icon: <RefreshIcon height={17} />,
            onClick: () => setRenewModalVisible(true),
            label: "Renew",
        });
    }
    if (isAdmin && status === ListingStatusTypes.UnderReview) {
        menuItems.push({
            icon: <CheckCircleIcon height={18} />,
            onClick: () => setReviewModalVisible(true),
            label: "Review",
        });
    }
    if (status && [ListingStatusTypes.Posted, ListingStatusTypes.Expired, ListingStatusTypes.TemporarilyUnlisted].includes(status)) {
        menuItems.push({
            icon: <EyeOffIcon height={17} />,
            onClick: () => setUnListModalVisible(true),
            label: "Unlist",
            classNames: "text-error hover:!bg-error hover:!text-error-content",
        });
    }
    if (isAdmin) {
        menuItems.push({
            icon: <TrashIcon height={18} />,
            onClick: () => setDeleteModalVisible(true),
            label: "Delete",
            classNames: "text-error hover:!bg-error hover:!text-error-content",
        });
    }

    return (
        <>
            <ContextMenu menuItems={menuItems} />
            <DeleteListingItemModal
                visible={deleteModalVisible}
                setVisible={setDeleteModalVisible}
                listingItem={listingItem as ListingItem}
                successRedirectPath={basePath || ""}
            />
            <RenewListingItemModal visible={renewModalVisible} setVisible={setRenewModalVisible} listingItem={listingItem as ListingItem} />
            <ReviewListingModal visible={reviewModalVisible} setVisible={setReviewModalVisible} listingItem={listingItem as ListingItem} />
            <UnListListingModal visible={unListModalVisible} setVisible={setUnListModalVisible} listingItem={listingItem as ListingItem} />
        </>
    );
};
