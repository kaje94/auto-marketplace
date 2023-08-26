"use client";
import { useRef, useState } from "react";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import { ReviewListingSchema } from "@/utils/schemas";
import { ListingIdType, ListingItem, ReviewListingReq } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, TextArea, ModalFooter, Modal } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import { reviewListingAction } from "@/app/_actions/listingActions";
import toast from "react-hot-toast";
import { ReviewListingModal } from "../../Modals/ReviewListingModal";

interface Props {
    listingItem?: ListingItem;
}

export const ReviewButton = ({ listingItem }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <button className="btn-ghost btn-sm btn" onClick={() => setModalVisible(true)}>
                Review
            </button>
            <ReviewListingModal setVisible={setModalVisible} visible={modalVisible} listingItem={listingItem} />
        </>
    );
};
