import { z } from "zod";
import {
    FuelTypes,
    ListingReportReason,
    ListingStatusTypes,
    SubscriptionFrequencies,
    TransmissionTypes,
    VehicleConditionTypes,
    VehicleTypes,
} from "./enum";
import { MaxVehicleImageCount, YearSelectMinYear } from "./constants";

const BooleanStringSchema = z.union([
    z.boolean(),
    z
        .string()
        .refine((value) => value === "true" || value === "false", {
            message: "Value must be 'true' or 'false'",
        })
        .transform((value) => value === "true"),
]);
export const PriceSchema = z.object({
    amount: z.preprocess(Number, z.number().min(1, "Price amount needs to be a positive number")),
    currency: z.string().default("LKR"),
    isPriceNegotiable: z.boolean().default(false),
});

export const OptionalPriceSchema = z.object({
    amount: z.preprocess(Number, z.number().min(0, "Price amount needs to be a positive number")).default(0),
    currency: z.string().default("LKR"),
    isPriceNegotiable: z.boolean().default(false),
});

// todo: set from user's values as default
export const LocationSchema = z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required").default("LK"),
    postalCode: z.preprocess(Number, z.number().min(1, "Postal code needs to be a positive number")),
});

export const VehicleImageSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1).optional(),
    url: z.string().url().optional(),
    color: z.string().min(1).optional(),
    isThumbnail: z.boolean().optional(),
    // locale file properties
    file: z.any().optional(),
    preview: z.string().optional(),
    averageColor: z.string().optional(),
    thumbHash: z.string().optional(),
    deleted: z.boolean().default(false).optional(),
});

export const VehicleFeatureSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
});

const YearSchema = z.string().refine(
    (value) => {
        const numericValue = Number(value);
        return numericValue >= YearSelectMinYear && numericValue <= new Date().getFullYear();
    },
    { message: `Year must be between ${YearSelectMinYear} and ${new Date().getFullYear()}` }
);

export const ListingIdField = z.number();
export const ListingSubscriptionIdField = z.number();

export const VehicleSchema = z.object({
    id: ListingIdField.optional(),
    type: z.nativeEnum(VehicleTypes, { invalid_type_error: "Invalid Vehicle Type" }),
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    trim: z.string().min(1, "Trim is required"), // todo: remove server side validation and make this optional!
    yearOfManufacture: YearSchema,
    yearOfRegistration: YearSchema,
    millage: z.preprocess(Number, z.number().min(1, "Milage needs to be a positive number")),
    condition: z.nativeEnum(VehicleConditionTypes, { invalid_type_error: "Invalid Condition Type" }),
    transmission: z.nativeEnum(TransmissionTypes, { invalid_type_error: "Invalid Transmission Type" }),
    fuelType: z.nativeEnum(FuelTypes, { invalid_type_error: "Invalid Fuel Type" }),
    engineCapacity: z.preprocess(Number, z.number().min(1, "Engine capacity needs to be a positive number")),
    vehicleImages: z
        .array(VehicleImageSchema)
        .refine((array) => array.filter((item) => !item.deleted).length > 0, {
            message: `At least one image is required`,
        })
        .refine((array) => array.filter((item) => !item.deleted).length <= MaxVehicleImageCount, {
            message: `Cannot have more than ${MaxVehicleImageCount} images`,
        })
        .refine((array) => array.some((item) => !item.deleted && item.isThumbnail), {
            message: `One of the image needs to be marked as a thumbnail`,
        }),
    features: z.array(VehicleFeatureSchema),
});

export const vehicleCreateSchema = VehicleSchema.omit({ features: true, id: true }).merge(z.object({ featureIds: z.array(z.number()) }));

export const CreateListingSchema = z.object({
    description: z.string().min(1, "Description is required").max(500, "Description cannot have more than 500 characters"),
    price: PriceSchema,
    hasOnGoingLease: z.boolean().default(false),
    location: LocationSchema,
    vehicle: vehicleCreateSchema,
});

export const EditListingSchema = CreateListingSchema.extend({
    listingId: ListingIdField,
});

export const CreateSubscriptionSchema = z.object({
    displayName: z.string().min(1),
    type: z.nativeEnum(VehicleTypes, { invalid_type_error: "Invalid Vehicle Type" }),
    brand: z.union([z.string(), z.null()]).optional(),
    model: z.union([z.string(), z.null()]).optional(),
    trim: z.union([z.string(), z.null()]).optional(),
    minYearOfManufacture: z.union([YearSchema, z.literal(""), z.null()]).optional(),
    maxYearOfManufacture: z.union([YearSchema, z.literal(""), z.null()]).optional(),
    minYearOfRegistration: z.union([YearSchema, z.literal(""), z.null()]).optional(),
    maxYearOfRegistration: z.union([YearSchema, z.literal(""), z.null()]).optional(),
    minMillage: z
        .union([z.preprocess(Number, z.number().min(1, "Minimum milage needs to be a positive number")), z.literal(""), z.null()])
        .optional(),
    maxMillage: z
        .union([z.preprocess(Number, z.number().min(1, "Minimum milage needs to be a positive number")), z.literal(""), z.null()])
        .optional(),
    condition: z.union([z.nativeEnum(VehicleConditionTypes, { invalid_type_error: "Invalid Condition Type" }), z.literal(""), z.null()]).optional(),
    minPrice: OptionalPriceSchema.optional(),
    maxPrice: OptionalPriceSchema.optional(),
    notificationFrequency: z.nativeEnum(SubscriptionFrequencies, { invalid_type_error: "Invalid frequency Type" }),
    subscriptionExpiryDate: z.string().min(1, "Expiration date is required"),
});

export const PostedListingsFilterSchema = z.object({
    Title: z.string().optional(),
    YomStartDate: z.union([z.string(), z.null()]).optional(),
    YomEndDate: z.union([z.string(), z.null()]).optional(),
    MinPrice: z.union([z.preprocess(Number, z.number().positive()), z.literal(""), z.null()]).optional(),
    MaxPrice: z.union([z.preprocess(Number, z.number().positive()), z.literal(""), z.null()]).optional(),
    City: z.string().optional(),
    Brand: z.string().optional(),
    Model: z.string().optional(),
    VehicleType: z.union([z.nativeEnum(VehicleTypes), z.literal(""), z.null()]).optional(),
    FuelType: z.union([z.nativeEnum(FuelTypes), z.literal(""), z.null()]).optional(),
    Condition: z.union([z.nativeEnum(VehicleConditionTypes), z.literal(""), z.null()]).optional(),
    Transmission: z.union([z.nativeEnum(TransmissionTypes), z.literal(""), z.null()]).optional(),
});

export const EditSubscriptionSchema = CreateSubscriptionSchema.extend({
    listingSubscriptionId: ListingSubscriptionIdField,
});

export const ReviewListingSchema = z.object({
    listingId: ListingIdField,
    status: z.nativeEnum(ListingStatusTypes),
    reviewComment: z.string(),
});

export const UnListListingSchema = z.object({
    listingId: ListingIdField,
    listingStatus: z.nativeEnum(ListingStatusTypes),
});

export const MyListingsFilterSchema = z.object({
    ListingStatus: z.union([z.nativeEnum(ListingStatusTypes), z.literal("")]).optional(),
    StartCreatedDate: z.string().optional(),
    EndCreatedDate: z.string().optional(),
});

export const DashboardListingFilterSchema = MyListingsFilterSchema.extend({
    Title: z.string().optional(),
    MinPrice: z.union([z.preprocess(Number, z.number().positive()), z.literal("")]).optional(),
    MaxPrice: z.union([z.preprocess(Number, z.number().positive()), z.literal("")]).optional(),
    City: z.string().optional(),
    Brand: z.string().optional(),
    Model: z.string().optional(),
    VehicleType: z.union([z.nativeEnum(VehicleTypes), z.literal("")]).optional(),
    FuelType: z.union([z.nativeEnum(FuelTypes), z.literal("")]).optional(),
    Condition: z.union([z.nativeEnum(VehicleConditionTypes), z.literal("")]).optional(),
    Transmission: z.union([z.nativeEnum(TransmissionTypes), z.literal("")]).optional(),
});

export const DashboardMySubscriptionFilterSchema = z.object({
    Active: z.union([BooleanStringSchema, z.literal("")]).optional(),
    NotificationFrequency: z.union([z.nativeEnum(SubscriptionFrequencies), z.literal("")]).optional(),
});

export const DashboardSubscriptionFilterSchema = DashboardMySubscriptionFilterSchema.extend({
    UserId: z.string().optional(),
});

export const ReportListingSchema = z.object({
    listingId: ListingIdField,
    reason: z.nativeEnum(ListingReportReason),
    emailAddress: z.string().email(),
    message: z.string().min(1, "A message is required"),
});

export const ToggleSubscriptionSchema = z.object({
    listingSubscriptionId: ListingSubscriptionIdField,
    subscriptionExpiryDate: z.union([z.string().min(1, "Expiration date is required"), z.date()]),
});

export const DashboardNotificationsFilterSchema = z.object({
    StartDate: z.string().optional(),
    EndDate: z.string().optional(),
    IsShown: z.union([z.union([z.literal("true").transform(() => true), z.literal("false").transform(() => false)]), z.literal("")]).optional(),
});
