"use client";
import { FC, useState } from "react";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { ContextMenu, ContextMenuItemProp } from "@/components/Common";
import { DeleteListingItemModal } from "@/components/Modals/DeleteListingItemModal";
import { RelistListingItemModal } from "@/components/Modals/RelistListingItemModal";
import { RenewListingItemModal } from "@/components/Modals/RenewListingItemModal";
import { ReviewListingModal } from "@/components/Modals/ReviewListingModal";
import { UnListListingModal } from "@/components/Modals/UnListListingModal";
import { CheckCircleIcon, EditIcon, EyeIcon, EyeOffIcon, RefreshIcon, TrashIcon } from "@/icons";
import { ListingStatusTypes } from "@/utils/enum";
import { isRenewableListing } from "@/utils/helpers";

interface Props {
    /** Base path to be used when forwarding to a subpath */
    basePath?: string;
    /** To enable admin functions */
    isAdmin?: boolean;
    /** Details of a particular listing item */
    listingItem?: ListingItem;
}

/** Context menu attached to a listing item */
export const DashboardListingItemMenu: FC<Props> = ({ listingItem = {}, isAdmin, basePath }) => {
    const { id: listingId, status, expiryDate } = listingItem as ListingItem;
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [renewModalVisible, setRenewModalVisible] = useState(false);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [unListModalVisible, setUnListModalVisible] = useState(false);
    const [relistModalVisible, setRelistModalVisible] = useState(false);

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
    if (
        isRenewableListing(new Date(expiryDate)) &&
        status &&
        [ListingStatusTypes.Posted, ListingStatusTypes.Expired].includes(status as ListingStatusTypes)
    ) {
        menuItems.push({
            icon: <RefreshIcon height={17} />,
            onClick: () => setRenewModalVisible(true),
            label: "Renew",
        });
    }
    if (status && ListingStatusTypes.TemporarilyUnlisted === status) {
        menuItems.push({
            icon: <RefreshIcon height={17} />,
            onClick: () => setRelistModalVisible(true),
            label: "Relist",
        });
    }
    if (isAdmin && status === ListingStatusTypes.UnderReview) {
        menuItems.push({
            icon: <CheckCircleIcon height={18} />,
            onClick: () => setReviewModalVisible(true),
            label: "Review",
        });
    }
    if (
        status &&
        [ListingStatusTypes.Posted, ListingStatusTypes.Expired, ListingStatusTypes.TemporarilyUnlisted].includes(status as ListingStatusTypes)
    ) {
        menuItems.push({
            icon: <EyeOffIcon height={17} />,
            onClick: () => setUnListModalVisible(true),
            label: status === ListingStatusTypes.TemporarilyUnlisted ? "Permanently Unlist" : "Unlist",
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
                listingItem={listingItem as ListingItem}
                successRedirectPath={basePath || ""}
                visible={deleteModalVisible}
                onVisibleChange={setDeleteModalVisible}
            />
            <RelistListingItemModal listingItem={listingItem as ListingItem} visible={relistModalVisible} onVisibleChange={setRelistModalVisible} />
            <RenewListingItemModal listingItem={listingItem as ListingItem} visible={renewModalVisible} onVisibleChange={setRenewModalVisible} />
            <ReviewListingModal listingItem={listingItem as ListingItem} visible={reviewModalVisible} onVisibleChange={setReviewModalVisible} />
            <UnListListingModal listingItem={listingItem as ListingItem} visible={unListModalVisible} onVisibleChange={setUnListModalVisible} />
        </>
    );
};
