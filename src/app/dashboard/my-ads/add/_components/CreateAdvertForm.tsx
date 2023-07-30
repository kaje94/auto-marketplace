"use client";
import { AdvertForm } from "@/app/_components";
import { AddListingReq, VehicleFeature } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { addAdvertAction } from "../_actions/AddAdvertAction";
import { CreateListingSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { convertYearToDateString, uploadToS3 } from "@/utils/helpers";
import { getPresignedS3Url } from "@/app/_actions/imageActions";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";

interface Props {
    features: VehicleFeature[];
}

export const CreateAdvertForm = (props: Props) => {
    const { features } = props;
    const router = useRouter();

    const form = useForm<AddListingReq>({
        resolver: zodResolver(CreateListingSchema),
        defaultValues: { vehicle: { vehicleImages: [] } },
        mode: "all",
    });

    const { mutate: addAdvertMutation, isLoading: isMutating } = useMutation(
        async (formValues: AddListingReq) => {
            const files = formValues.vehicle.vehicleImages;
            const vehicleImages = await Promise.all(
                files.map(async (item) => {
                    if (item.file && item.preview) {
                        const compressedFile = await imageCompression(item.file, {
                            fileType: "image/webp",
                            initialQuality: 0.7,
                            maxWidthOrHeight: 1920,
                            maxSizeMB: 0.5,
                        });
                        const { url, key, bucket, region } = await getPresignedS3Url(compressedFile.type, compressedFile?.length);
                        const uploadedResp = await uploadToS3(compressedFile, url, key, bucket, region, item.preview);
                        return { color: uploadedResp.color, isThumbnail: item.isThumbnail, name: key, url: uploadedResp.url };
                    }
                    return item;
                })
            );
            console.log("resp", vehicleImages);

            const requestBody: AddListingReq = {
                ...formValues,
                vehicle: {
                    ...formValues.vehicle,
                    vehicleImages: vehicleImages,
                    yearOfManufacture: convertYearToDateString(formValues.vehicle.yearOfManufacture),
                    yearOfRegistration: convertYearToDateString(formValues.vehicle.yearOfRegistration),
                },
            };
            console.log("requestBody", requestBody);
            return addAdvertAction(requestBody);
        },
        { onSuccess: (id) => router.replace(`/listing/item/${id}`) }
    );

    return <AdvertForm featureOptions={features} form={form} isMutating={isMutating} onMutate={addAdvertMutation} />;
};
