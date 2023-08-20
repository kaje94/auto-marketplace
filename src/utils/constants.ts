import { VehicleTypes, VehicleConditionTypes, TransmissionTypes, FuelTypes, ListingStatusTypes } from "./enum";
import { LabelValue, KeyValue } from "./types";

export const MaxVehicleImageCount = 10;

export const ListingStatusDescriptions: {
    [key in ListingStatusTypes]: string;
} = {
    [ListingStatusTypes.UnderReview]: "This advert is under review and will be made publicly available once it has been approved",
    [ListingStatusTypes.Posted]: "This advert has been posted and is publicly available",
    [ListingStatusTypes.Declined]: "This advert has been declined by system administrators.",
    [ListingStatusTypes.Expired]: "This advert is expired. Please renew it in order for it to be made publicly available again",
    [ListingStatusTypes.Sold]: "This vehicle has been marked as sold",
    [ListingStatusTypes.TemporarilyUnlisted]: "This advert has been temporarily unlisted and therefore will not be publicly visible",
    [ListingStatusTypes.PermanentlyRemoved]: "This advert has been permanently removed",
};

export const VehicleTypeList: LabelValue[] = Object.keys(VehicleTypes).map((key) => ({
    value: key,
    label: (VehicleTypes as KeyValue)[key]!,
}));

export const VehicleConditionList: LabelValue[] = Object.keys(VehicleConditionTypes).map((key) => ({
    value: key,
    label: (VehicleConditionTypes as KeyValue)[key]!,
}));

export const TransmissionTypeList: LabelValue[] = Object.keys(TransmissionTypes).map((key) => ({
    value: key,
    label: (TransmissionTypes as KeyValue)[key]!,
}));

export const FuelTypeList: LabelValue[] = Object.keys(FuelTypes).map((key) => ({
    value: key,
    label: (FuelTypes as KeyValue)[key]!,
}));

export const ListingTypeList: LabelValue[] = Object.keys(ListingStatusTypes).map((key) => ({
    value: key,
    label: (ListingStatusTypes as KeyValue)[key]!,
}));
