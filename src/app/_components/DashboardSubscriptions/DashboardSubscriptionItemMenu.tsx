"use client";
import { BellIcon, BellOffIcon, EditIcon, TrashIcon } from "@/icons";
import { ListingSubscriptionItem } from "@/utils/types";
import { FC, useState } from "react";
import { DeleteSubscriptionItemModal } from "@/app/_components/Modals/DeleteSubscriptionItemModal";
import { ToggleSubscriptionActivationModal } from "@/app/_components/Modals/ToggleSubscriptionActivationModal";
import { ContextMenu } from "../Common/ContextMenu";

interface Props {
    listingSubscriptionItem?: ListingSubscriptionItem;
    basePath?: string;
}

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
