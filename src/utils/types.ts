import { z } from "zod";
import {
    CreateListingSchema,
    CreateSubscriptionSchema,
    DashboardListingFilterSchema,
    DashboardMySubscriptionFilterSchema,
    DashboardSubscriptionFilterSchema,
    EditListingSchema,
    EditSubscriptionSchema,
    ListingIdField,
    ListingSubscriptionIdField,
    LocationSchema,
    MyListingsFilterSchema,
    PriceSchema,
    ReportListingSchema,
    ReviewListingSchema,
    ToggleSubscriptionSchema,
    UnListListingSchema,
    VehicleFeatureSchema,
    VehicleImageSchema,
    VehicleSchema,
    vehicleCreateSchema,
} from "./schemas";
import { ListingStatusTypes, SubscriptionFrequencies, VehicleConditionTypes, VehicleTypes } from "./enum";

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
    id: ListingIdType;
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
    createdOn: string;
    user?: ListingUser;
};

export type ListingSubscriptionItem = {
    id: ListingSubscriptionIdType;
    active: boolean;
    userId: string;
    displayName: string;
    type?: VehicleTypes;
    brand?: string;
    model?: string;
    trim?: string;
    minMillage?: number;
    maxMillage?: number;
    condition?: VehicleConditionTypes;
    minPrice?: Price;
    maxPrice?: Price;
    minYearOfManufacture?: string;
    maxYearOfManufacture?: string;
    minYearOfRegistration?: string;
    maxYearOfRegistration?: string;
    notificationFrequency: SubscriptionFrequencies;
    subscriptionExpiryDate: string;
    createdOn: string;
    user?: ListingUser;
};

export type VehicleBrand = {
    id: string;
    name: string;
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

// todo: use this for all other instances as well
export type SearchParams = { searchParams: { [key: string]: string | string[] | undefined } };

export type ImageFile = z.infer<typeof VehicleImageSchema>;

export type VehicleFeature = z.infer<typeof VehicleFeatureSchema>;

export type VehicleCreate = z.infer<typeof vehicleCreateSchema>;

export type CreateListingReq = z.infer<typeof CreateListingSchema>;

export type CreateSubscriptionReq = z.infer<typeof CreateSubscriptionSchema>;

export type EditSubscriptionReq = z.infer<typeof EditSubscriptionSchema>;

export type EditListingReq = z.infer<typeof EditListingSchema>;

export type ListingItems = { items: ListingItem[] };

export type ListingSubscriptionItems = { items: ListingSubscriptionItem[] };

export type ReviewListingReq = z.infer<typeof ReviewListingSchema>;

export type UnListListingReq = z.infer<typeof UnListListingSchema>;

export type ReportListingReq = z.infer<typeof ReportListingSchema>;

export type DashboardListFilterReq = z.infer<typeof DashboardListingFilterSchema>;

export type DashboardSubscriptionFilterReq = z.infer<typeof DashboardSubscriptionFilterSchema>;

export type DashboardMySubscriptionFilterReq = z.infer<typeof DashboardMySubscriptionFilterSchema>;

export type MyListingsFilterReq = z.infer<typeof MyListingsFilterSchema>;

export type ListingIdType = z.infer<typeof ListingIdField>;

export type ListingSubscriptionIdType = z.infer<typeof ListingSubscriptionIdField>;

export type ToggleSubscriptionReq = z.infer<typeof ToggleSubscriptionSchema>;
