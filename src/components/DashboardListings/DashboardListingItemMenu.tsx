"use client";
import { FC, useState } from "react";
import { ContextMenu, ContextMenuItemProp } from "@/components/Common";
import { DeleteListingItemModal } from "@/components/Modals/DeleteListingItemModal";
import { RenewListingItemModal } from "@/components/Modals/RenewListingItemModal";
import { ReviewListingModal } from "@/components/Modals/ReviewListingModal";
import { UnListListingModal } from "@/components/Modals/UnListListingModal";
import { CheckCircleIcon, EditIcon, EyeIcon, EyeOffIcon, RefreshIcon, TrashIcon } from "@/icons";
import { useScopedI18n } from "@/locales/client";
import { ListingStatusTypes } from "@/utils/enum";
import { ListingItem } from "@/utils/types";

interface Props {
    basePath?: string;
    isAdmin?: boolean;
    listingItem?: ListingItem;
}

export const DashboardListingItemMenu: FC<Props> = ({ listingItem = {}, isAdmin, basePath }) => {
    const { id: listingId, status } = listingItem as ListingItem;
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [renewModalVisible, setRenewModalVisible] = useState(false);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [unListModalVisible, setUnListModalVisible] = useState(false);

    const menuItems: ContextMenuItemProp[] = [];

    const tCommon = useScopedI18n("common");

    if (status && status === ListingStatusTypes.Posted) {
        menuItems.push({
            icon: <EyeIcon height={18} />,
            link: `/search/${listingId}`,
            label: tCommon("viewAd"),
        });
    }
    menuItems.push({
        icon: <EditIcon height={18} />,
        link: `${basePath}/edit/${listingId}`,
        label: tCommon("edit"),
    });
    if (status && [ListingStatusTypes.Posted, ListingStatusTypes.Expired, ListingStatusTypes.TemporarilyUnlisted].includes(status)) {
        menuItems.push({
            icon: <RefreshIcon height={17} />,
            onClick: () => setRenewModalVisible(true),
            label: tCommon("renew"),
        });
    }
    if (isAdmin && status === ListingStatusTypes.UnderReview) {
        menuItems.push({
            icon: <CheckCircleIcon height={18} />,
            onClick: () => setReviewModalVisible(true),
            label: tCommon("review"),
        });
    }
    if (status && [ListingStatusTypes.Posted, ListingStatusTypes.Expired, ListingStatusTypes.TemporarilyUnlisted].includes(status)) {
        menuItems.push({
            icon: <EyeOffIcon height={17} />,
            onClick: () => setUnListModalVisible(true),
            label: tCommon("unlist"),
            classNames: "text-error hover:!bg-error hover:!text-error-content",
        });
    }
    if (isAdmin) {
        menuItems.push({
            icon: <TrashIcon height={18} />,
            onClick: () => setDeleteModalVisible(true),
            label: tCommon("delete"),
            classNames: "text-error hover:!bg-error hover:!text-error-content",
        });
    }

    return (
        <>
            <ContextMenu menuItems={menuItems} />
            <DeleteListingItemModal
                listingItem={listingItem as ListingItem}
                setVisible={setDeleteModalVisible}
                successRedirectPath={basePath || ""}
                visible={deleteModalVisible}
            />
            <RenewListingItemModal listingItem={listingItem as ListingItem} setVisible={setRenewModalVisible} visible={renewModalVisible} />
            <ReviewListingModal listingItem={listingItem as ListingItem} setVisible={setReviewModalVisible} visible={reviewModalVisible} />
            <UnListListingModal listingItem={listingItem as ListingItem} setVisible={setUnListModalVisible} visible={unListModalVisible} />
        </>
    );
};
