import { z } from "zod";
import { CreateListingSchema, LocationSchema, PriceSchema, VehicleFeatureSchema, VehicleImageSchema, VehicleSchema } from "./schemas";

type Price = z.infer<typeof PriceSchema>;

type Location = z.infer<typeof LocationSchema>;

type User = {
    id: string;
    firstName: string;
    lastName: string;
    isDealership: boolean;
    address: Location;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    phone: string;
    phoneConfirmed: boolean;
};

type Vehicle = z.infer<typeof VehicleSchema>;

type ListingItem = {
    id: string;
    title: string;
    description: string;
    price: Price;
    location: Location;
    hasOnGoingLease: boolean;
    status: string; // todo: get possible enum values
    expiryDate: string;
    reviewComment?: string;
    vehicle: Vehicle;
    userId?: string;
    user?: User;
};

export type PaginatedResponse = {
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
};

export type ImageFile = z.infer<typeof VehicleImageSchema>;

export type VehicleFeature = z.infer<typeof VehicleFeatureSchema>;

export type AddListingReq = z.infer<typeof CreateListingSchema>;

export type ListingItems = { items: ListingItem[] };
