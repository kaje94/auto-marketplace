import { z } from "zod";
import {
    CreateListingSchema,
    DashboardListingFilterSchema,
    EditListingSchema,
    ListingIdField,
    LocationSchema,
    MyListingsFilterSchema,
    PriceSchema,
    ReportListingSchema,
    ReviewListingSchema,
    VehicleFeatureSchema,
    VehicleImageSchema,
    VehicleSchema,
    vehicleCreateSchema,
} from "./schemas";
import { ListingStatusTypes } from "./enum";

export type KeyValue = { [key: string]: string };

export type LabelValue = {
    label: string;
    value: string | number;
};

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

export type VehicleCreate = z.infer<typeof vehicleCreateSchema>;

export type CreateListingReq = z.infer<typeof CreateListingSchema>;

export type EditListingReq = z.infer<typeof EditListingSchema>;

export type ListingItems = { items: ListingItem[] };

// todo: use this for all other instances as well
export type SearchParams = { searchParams: { [key: string]: string | string[] | undefined } };

export type ReviewListingReq = z.infer<typeof ReviewListingSchema>;

export type ReportListingReq = z.infer<typeof ReportListingSchema>;

export type DashboardListFilterReq = z.infer<typeof DashboardListingFilterSchema>;

export type MyListingsFilterReq = z.infer<typeof MyListingsFilterSchema>;

export type ListingIdType = z.infer<typeof ListingIdField>;
