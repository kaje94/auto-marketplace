"use client";
import { ListingForm } from "@/app/_components/ListingForm";
import { CreateListingReq, VehicleFeature } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { createListingAction } from "../_actions/CreateListingAction";
import { CreateListingSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { convertYearToDateString, previewUrlToHash, uploadToS3 } from "@/utils/helpers";
import { getPresignedS3Url } from "@/app/_actions/imageActions";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRef } from "react";

interface Props {
    features: VehicleFeature[];
}

export const CreateListingForm = (props: Props) => {
    const { features } = props;
    const router = useRouter();

    const toastId = useRef<string>();

    const form = useForm<CreateListingReq>({
        resolver: zodResolver(CreateListingSchema),
        defaultValues: { vehicle: { vehicleImages: [], featureIds: [] } },
        mode: "all",
    });

    const { mutate: createListingsMutation, isLoading: isMutating } = useMutation(
        async (formValues: CreateListingReq) => {
            const files = formValues.vehicle.vehicleImages;
            const vehicleImages = await Promise.all(
                files.map(async (item) => {
                    if (item.file && item.preview) {
                        const compressedFile = await imageCompression(item.file as File, {
                            fileType: "image/webp",
                            initialQuality: 0.7,
                            maxWidthOrHeight: 1920, // todo: also try 1280 size
                            maxSizeMB: 0.5,
                        });
                        const hash = await previewUrlToHash(item.preview);
                        const { url, key, bucket, region } = await getPresignedS3Url(compressedFile.type, compressedFile?.length);
                        const uploadedResp = await uploadToS3(compressedFile, url, key, bucket, region, item.preview);
                        return { color: hash, isThumbnail: item.isThumbnail, name: key, url: uploadedResp.url };
                    }
                    return item;
                })
            );

            const requestBody: CreateListingReq = {
                ...formValues,
                vehicle: {
                    ...formValues.vehicle,
                    vehicleImages: vehicleImages,
                    yearOfManufacture: convertYearToDateString(formValues.vehicle.yearOfManufacture),
                    yearOfRegistration: convertYearToDateString(formValues.vehicle.yearOfRegistration),
                },
            };
            return createListingAction(requestBody);
        },
        {
            onSuccess: () => {
                router.replace(`/dashboard/listings`);
            },
            onMutate: () => {
                toastId.current = toast.loading("Creating new Advert...");
            },
            onSettled: (_data, err) => {
                if (err) {
                    toast.error(`Failed to create advert. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
                } else {
                    toast.success("Successfully created a new Advert", { id: toastId?.current });
                }
            },
        }
    );

    return <ListingForm featureOptions={features} form={form} isMutating={isMutating} onMutate={createListingsMutation} />;
};
