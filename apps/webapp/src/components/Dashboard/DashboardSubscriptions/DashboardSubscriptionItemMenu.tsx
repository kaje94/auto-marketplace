"use client";
import { FC, useState } from "react";
import { SubscriptionItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { ContextMenu } from "@/components/Common/ContextMenu";
import { DeleteSubscriptionItemModal } from "@/components/Modals/DeleteSubscriptionItemModal";
import { ToggleSubscriptionActivationModal } from "@/components/Modals/ToggleSubscriptionActivationModal";
import { BellIcon, BellOffIcon, EditIcon, TrashIcon } from "@/icons";

interface Props {
    /** Base path to be used when forwarding to a subpath */
    basePath?: string;
    /** Details of a particular subscription item */
    subscriptionItem?: SubscriptionItem;
}

/** Context menu attached to a subscription item */
export const DashboardSubscriptionItemMenu: FC<Props> = ({ subscriptionItem = {}, basePath }) => {
    const { id, active } = subscriptionItem as SubscriptionItem;
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
                subscriptionItem={subscriptionItem as SubscriptionItem}
                visible={deleteModalVisible}
                onVisibleChange={setDeleteModalVisible}
            />
            <ToggleSubscriptionActivationModal
                subscriptionItem={subscriptionItem as SubscriptionItem}
                visible={activationModalVisible}
                onVisibleChange={setActivationModalVisible}
            />
        </>
    );
};
