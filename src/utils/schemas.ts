import { z } from "zod";
import { MaxVehicleImageCount, YearSelectMinYear } from "./constants";
import {
    FuelTypes,
    ListingReportReason,
    ListingStatusTypes,
    SubscriptionFrequencies,
    TransmissionTypes,
    VehicleConditionTypes,
    VehicleTypes,
} from "./enum";

const BooleanStringSchema = z.union([
    z.boolean(),
    z
        .string()
        .refine((value) => value === "true" || value === "false", {
            message: "Value must be 'true' or 'false'",
        })
        .transform((value) => value === "true"),
]);

const phoneRegex = new RegExp(/^[0-9]{7,14}$/);

const removeCommas = (input: string) => input.replace(/,/g, "");

const getNumericSchema = (message: string = "Invalid value", minValue: number = 1, defaultVal: string = "") =>
    z.union([
        z
            .string()
            .transform(removeCommas)
            .refine(
                (value) => {
                    const numberValue = Number(value);
                    return !isNaN(numberValue) && numberValue >= minValue;
                },
                { message },
            )
            .default(defaultVal),
        z.number(),
    ]);

export const PriceSchema = z.object({
    amount: getNumericSchema("Price amount needs to be a positive number"),
    currencyCode: z.string().min(1, "Currency code is required"),
    currencySymbol: z.string().min(1, "Currency symbol is required"),
    isPriceNegotiable: z.boolean().default(true),
});

export const OptionalPriceSchema = z.object({
    amount: z.union([getNumericSchema("Price amount needs to be a positive number", 0, "0"), z.null()]),
    currencyCode: z.string().min(1, "Currency code is required").optional(),
    currencySymbol: z.string().min(1, "Currency symbol is required").optional(),
    isPriceNegotiable: z.boolean().default(true).optional(),
});

export const MilageSchema = z.object({
    distance: getNumericSchema("Milage needs to be a positive number"),
    unit: z.string().min(1, "Milage unit is required"),
});

export const OptionalMilageSchema = z.object({
    distance: z.union([getNumericSchema("Milage needs to be a positive number", 0, "0"), z.null()]),
    unit: z.string().min(1, "Milage unit is required"),
});

export const LocationSchema = z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required").default("LK"),
    postalCode: z.string().min(1, "Postal code is required"),
});

export const VehicleImageSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1).optional(),
    url: z.string().url().optional(),
    color: z.string().min(1).optional(),
    hash: z.string().optional(),
    isThumbnail: z.boolean().optional(),
    // local file properties
    file: z.any().optional(),
    preview: z.string().optional(),
    deleted: z.boolean().default(false).optional(),
});

export const VehicleFeatureSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
});

const YearSchema = z.string().refine(
    (value) => {
        const numericValue = Number(value);
        return numericValue >= YearSelectMinYear && numericValue <= new Date().getFullYear();
    },
    { message: `Year must be between ${YearSelectMinYear} and ${new Date().getFullYear()}` },
);

export const ListingIdField = z.string();
export const ListingSubscriptionIdField = z.string();

export const VehicleSchema = z.object({
    id: ListingIdField.optional(),
    type: z.nativeEnum(VehicleTypes, { invalid_type_error: "Invalid Vehicle Type" }),
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    trim: z.string().optional(),
    yearOfManufacture: YearSchema,
    yearOfRegistration: z.union([z.literal(""), z.null(), YearSchema]).optional(),
    millage: MilageSchema,
    condition: z.nativeEnum(VehicleConditionTypes, { invalid_type_error: "Invalid Condition Type" }),
    transmission: z.nativeEnum(TransmissionTypes, { invalid_type_error: "Invalid Transmission Type" }),
    fuelType: z.nativeEnum(FuelTypes, { invalid_type_error: "Invalid Fuel Type" }),
    engineCapacity: getNumericSchema("Engine capacity needs to be a positive number"),
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

export const vehicleCreateSchema = VehicleSchema.omit({ features: true, id: true }).merge(z.object({ featureIds: z.array(z.string()) }));

export const CreateListingSchema = z.object({
    description: z.string().min(1, "Description is required").max(2000, "Description cannot have more than 2000 characters"),
    price: PriceSchema,
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
    minMillage: OptionalMilageSchema.optional(),
    maxMillage: OptionalMilageSchema.optional(),
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
    MinPrice: z.union([getNumericSchema(), z.literal(""), z.null()]).optional(),
    MaxPrice: z.union([getNumericSchema(), z.literal(""), z.null()]).optional(),
    State: z.union([z.string(), z.null()]).optional(),
    City: z.union([z.string(), z.null()]).optional(),
    Brand: z.union([z.string(), z.null()]).optional(),
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
    MinPrice: z.union([getNumericSchema("", 0), z.literal("")]).optional(),
    MaxPrice: z.union([getNumericSchema("", 0), z.literal("")]).optional(),
    City: z.union([z.string(), z.null()]).optional(),
    State: z.union([z.string(), z.null()]).optional(),
    Country: z.union([z.string(), z.null()]).optional(),
    Brand: z.union([z.string(), z.null()]).optional(),
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

export const UpdateProfileSchema = z.object({
    userId: z.string(),
    isDealership: z.boolean(),
    address: z.object({
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        country: z.string().min(1, "Country is required").default("LK"),
        postalCode: z.string().min(1, "Postal code is required"),
    }),
    phoneNumber: z.string().min(1, "Contact number is required").regex(phoneRegex, "Invalid phone number"),
});

export const ContactUsSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email(),
    subject: z.string().min(1, "Subject is required").max(300, "Subject cannot have more than 300 characters"),
    message: z.string().min(1, "Message is required").max(5000, "Message cannot have more than 5000 characters"),
});

export const GenerateS3SignedUrl = z.object({
    imageMetaDatas: z.array(
        z.object({
            fileType: z.string(),
            fileSize: z.number(),
        }),
    ),
});

export const DeleteS3Images = z.object({
    keys: z.array(z.string()),
});
