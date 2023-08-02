import { z } from "zod";
import { CreateListingSchema, LocationSchema, PriceSchema, VehicleFeatureSchema, VehicleImageSchema, VehicleSchema } from "./schemas";

export enum Errors {
    Unauthorized = "Unauthorized",
}

// todo: check following conditions
export enum ListingStatusTypes {
    UnderReview = "UnderReview", // can edit
    Posted = "Posted", // can edit
    Declined = "Declined", // can edit
    Expired = "Expired", // can only renew
    Sold = "Sold", // lisintg screen or detail screen
    // just show one button and let user select temporary or permanent
    TemporarilyUnlisted = "TemporarilyUnlisted", // just show one button and let user select temporary or permanent lisintg screen or detail screen
    PermanentlyRemoved = "PermanentlyRemoved", // lisintg screen or detail screen
}

type Price = z.infer<typeof PriceSchema>;

export type Location = z.infer<typeof LocationSchema>;

export type ListingUser = {
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

export type Vehicle = z.infer<typeof VehicleSchema>;

export type ListingItem = {
    id: number;
    title: string;
    description: string;
    price: Price;
    location: Location;
    hasOnGoingLease: boolean;
    status: ListingStatusTypes;
    expiryDate: string;
    reviewComment?: string;
    vehicle: Vehicle;
    userId?: string;
    user?: ListingUser;
};

export type PaginatedResponse = {
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
};

export type PaginatedRequest = {
    PageNumber?: number;
    PageSize?: number;
};

export type ImageFile = z.infer<typeof VehicleImageSchema>;

export type VehicleFeature = z.infer<typeof VehicleFeatureSchema>;

export type AddListingReq = z.infer<typeof CreateListingSchema>;

export type ListingItems = { items: ListingItem[] };

export type SearchParams = { searchParams: { [key: string]: string | string[] | undefined } };
