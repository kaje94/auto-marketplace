import { Errors } from "./types";

// todo: check & remove
export const ErrorMessages = {
    [Errors.Unauthorized]: "User is Please Login to perform this action",
};

/*
// todo: replace
    Car,
    Van,
    Suv,
    Jeep,
    CrewCab,
    DoubleCab,
    Bus,
    Lorry,
    ThreeWheel,
    Motorcycle,
    Other
*/
export const VehicleTypes = [
    { label: "Car", value: "Car" },
    { label: "SUV", value: "SUV" },
    { label: "Van", value: "Van" },
];

export const VehicleConditions = [
    { label: "Brand New", value: "BrandNew" },
    { label: "Registered", value: "Registered" },
    { label: "Reconditioned", value: "Reconditioned" },
];

export const TransmissionTypes = [
    { label: "Automatic", value: "Automatic" },
    { label: "Manual", value: "Manual" },
    { label: "Tiptronic", value: "Tiptronic" },
    { label: "Other", value: "Other" },
];

export const FuelTypes = [
    { label: "Petrol", value: "Petrol" },
    { label: "Diesel", value: "Diesel" },
    { label: "Hybrid", value: "Hybrid" },
    { label: "Electric", value: "Electric" },
    { label: "Other", value: "Other" },
];
