"use server";

import { PartialMessage } from "@bufbuild/protobuf";
import { fromPreTrained } from "@lenml/tokenizer-text_embedding_ada002";
import { ListingItem_Data, UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { VEHICLE_BRANDS } from "./brands";
import { VehicleConditionTypes, VehicleTypes } from "./enum";

export const getTextEmbeddings = (listingItemData: PartialMessage<ListingItem_Data>, listingUser: PartialMessage<UserProfile>): number[] => {
    const tokenizer = fromPreTrained();

    const getVehicleTypeEmbed = (type: string) => {
        if (type === VehicleTypes.ThreeWheeler) {
            return "Auto";
        } else if (type === VehicleTypes.Motorcycle) {
            return "Cycle";
        } else if (type === VehicleTypes.SUV) {
            return "Utility";
        } else {
            return type;
        }
    };
    const embeddings: number[] = [
        tokenizer.encode(VEHICLE_BRANDS.findIndex((item) => item === listingItemData?.brand).toString()).shift() ?? 0,
        parseInt(tokenizer.encode(listingItemData?.model?.replaceAll(" ", "") || "model").join()),
        parseInt(tokenizer.encode(listingItemData?.trim?.replaceAll(" ", "") || "trim").join()),
        tokenizer.encode(listingItemData?.yearOfManufacture?.toString()!).shift() ?? 0,
        tokenizer.encode(listingItemData?.condition === VehicleConditionTypes.BrandNew ? "New" : listingItemData?.condition!).shift() ?? 0,
        tokenizer.encode(getVehicleTypeEmbed(listingItemData?.type!)).shift() ?? 0,
        tokenizer.encode(listingItemData?.transmissionType!).shift() ?? 0,
        tokenizer.encode(listingItemData?.fuelType!).shift() ?? 0,
        parseInt(tokenizer.encode(listingUser?.data?.city?.replaceAll(" ", "") || "city").join()),
        parseInt(tokenizer.encode(listingUser?.data?.state?.replaceAll(" ", "") || "state").join()),
        tokenizer.encode(listingUser?.data?.countryCode!).shift() ?? 0,
    ];

    return embeddings;
};
