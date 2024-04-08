import {
    FuelTypes,
    ListingReportReason,
    ListingStatusTypes,
    SubscriptionFrequencies,
    TransmissionTypes,
    VehicleConditionTypes,
    VehicleTypes,
} from "./enum";
import { KeyValue, LabelValue } from "./types";

export const MaxVehicleImageCount = 10;
export const YearSelectMinYear = 1960;

/** Locale param to be used when visited by web crawlers */
export const BOT_LOCALE = "ctry";

export const Dates = {
    Days_7_from_now: new Date(new Date().setHours(new Date().getHours() + 24 * 7 + 1)),
    Days_8_from_now: new Date(new Date().setHours(new Date().getHours() + 24 * 8 + 1)),
    Months_1_from_now: new Date(new Date().setHours(new Date().getHours() + 24 * 31)),
    Months_3_from_now: new Date(new Date().setHours(new Date().getHours() + 24 * (31 * 3))),
    Year_from_now: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
};

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

export const ListingReportReasonList: LabelValue[] = Object.keys(ListingReportReason).map((key) => ({
    value: key,
    label: (ListingReportReason as KeyValue)[key]!,
}));

export const SubscriptFrequenciesList: LabelValue[] = Object.keys(SubscriptionFrequencies).map((key) => ({
    value: key,
    label: (SubscriptionFrequencies as KeyValue)[key]!,
}));

export const YearRangeList: LabelValue[] = Array.from({ length: new Date().getFullYear() - YearSelectMinYear + 1 }, (_, index) => {
    const year = new Date().getFullYear() - index;
    return {
        value: year.toString(),
        label: year.toString(),
    };
});
