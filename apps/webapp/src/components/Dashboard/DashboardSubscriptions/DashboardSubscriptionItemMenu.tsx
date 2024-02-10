"use client";
import { FC, useState } from "react";
import { ContextMenu } from "@/components/Common/ContextMenu";
import { DeleteSubscriptionItemModal } from "@/components/Modals/DeleteSubscriptionItemModal";
import { ToggleSubscriptionActivationModal } from "@/components/Modals/ToggleSubscriptionActivationModal";
import { BellIcon, BellOffIcon, EditIcon, TrashIcon } from "@/icons";
import { ListingSubscriptionItem } from "@/utils/types";

interface Props {
    /** Base path to be used when forwarding to a subpath */
    basePath?: string;
    /** Details of a particular subscription item */
    listingSubscriptionItem?: ListingSubscriptionItem;
}

/** Context menu attached to a subscription item */
export const DashboardSubscriptionItemMenu: FC<Props> = ({ listingSubscriptionItem = {}, basePath }) => {
    const { id, active } = listingSubscriptionItem as ListingSubscriptionItem;
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [activationModalVisible, setActivationModalVisible] = useState(false);

    return (
        <>
            <ContextMenu
                menuItems={[
                    {
                        icon: <EditIcon height={18} />,
                        link: `${basePath}/edit/${id}`,
                        label: "Edit",
                    },
                    {
                        icon: active ? <BellOffIcon height={18} /> : <BellIcon height={18} />,
                        onClick: () => setActivationModalVisible(true),
                        label: active ? "Deactivate" : "Activate",
                    },
                    {
                        icon: <TrashIcon height={18} />,
                        onClick: () => setDeleteModalVisible(true),
                        label: "Delete",
                        classNames: "text-error hover:!bg-error hover:!text-error-content",
                    },
                ]}
            />
            <DeleteSubscriptionItemModal
                listingSubscriptionItem={listingSubscriptionItem as ListingSubscriptionItem}
                visible={deleteModalVisible}
                onVisibleChange={setDeleteModalVisible}
            />
            <ToggleSubscriptionActivationModal
                listingSubscriptionItem={listingSubscriptionItem as ListingSubscriptionItem}
                visible={activationModalVisible}
                onVisibleChange={setActivationModalVisible}
            />
        </>
    );
};
