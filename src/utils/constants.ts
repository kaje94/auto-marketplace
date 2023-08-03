import { VehicleTypes, VehicleConditionTypes, TransmissionTypes, FuelTypes } from "./enum";
import { LabelValue, KeyValue } from "./types";

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
