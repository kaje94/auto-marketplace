"use client";
import { FC, useState } from "react";
import { ContextMenu } from "@/components/Common/ContextMenu";
import { DeleteSubscriptionItemModal } from "@/components/Modals/DeleteSubscriptionItemModal";
import { ToggleSubscriptionActivationModal } from "@/components/Modals/ToggleSubscriptionActivationModal";
import { BellIcon, BellOffIcon, EditIcon, TrashIcon } from "@/icons";
import { useScopedI18n } from "@/locales/client";
import { ListingSubscriptionItem } from "@/utils/types";

interface Props {
    basePath?: string;
    listingSubscriptionItem?: ListingSubscriptionItem;
}

export const DashboardSubscriptionItemMenu: FC<Props> = ({ listingSubscriptionItem = {}, basePath }) => {
    const { id, active } = listingSubscriptionItem as ListingSubscriptionItem;
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [activationModalVisible, setActivationModalVisible] = useState(false);

    const tCommon = useScopedI18n("common");

    return (
        <>
            <ContextMenu
                menuItems={[
                    {
                        icon: <EditIcon height={18} />,
                        link: `${basePath}/edit/${id}`,
                        label: tCommon("edit"),
                    },
                    {
                        icon: active ? <BellOffIcon height={18} /> : <BellIcon height={18} />,
                        onClick: () => setActivationModalVisible(true),
                        label: active ? tCommon("deactivate") : tCommon("activate"),
                    },
                    {
                        icon: <TrashIcon height={18} />,
                        onClick: () => setDeleteModalVisible(true),
                        label: tCommon("delete"),
                        classNames: "text-error hover:!bg-error hover:!text-error-content",
                    },
                ]}
            />
            <DeleteSubscriptionItemModal
                listingSubscriptionItem={listingSubscriptionItem as ListingSubscriptionItem}
                setVisible={setDeleteModalVisible}
                visible={deleteModalVisible}
            />
            <ToggleSubscriptionActivationModal
                listingSubscriptionItem={listingSubscriptionItem as ListingSubscriptionItem}
                setVisible={setActivationModalVisible}
                visible={activationModalVisible}
            />
        </>
    );
};
