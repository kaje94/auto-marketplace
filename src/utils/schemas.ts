import { z } from "zod";
import { FuelTypes, ListingStatusTypes, TransmissionTypes, VehicleConditionTypes, VehicleTypes } from "./enum";
import { MaxVehicleImageCount } from "./constants";

export const PriceSchema = z.object({
    amount: z.preprocess(Number, z.number().min(1, "Price amount needs to be a positive number")),
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
    // remote file properties
    id: z.number().optional(),
    name: z.string().min(1).optional(),
    url: z.string().url().optional(),
    color: z.string().min(1).optional(),
    isThumbnail: z.boolean().optional(),
    // locale file properties
    // file: z.instanceof(File).optional(), // todo: fix since it throws an error saying File not found
    file: z.any().optional(),
    preview: z.string().optional(),
    blurDataURL: z.string().optional(),
    deleted: z.boolean().default(false).optional(),
});

export const VehicleFeatureSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
});

const YearSchema = z.string().refine(
    (value) => {
        const numericValue = Number(value);
        return numericValue >= 1900 && numericValue <= new Date().getFullYear();
    },
    { message: `Year must be between 1960 and ${new Date().getFullYear()}` }
);

const listingId = z.number();

export const VehicleSchema = z.object({
    id: listingId.optional(),
    type: z.nativeEnum(VehicleTypes, { invalid_type_error: "Invalid Vehicle Type" }),
    brand: z.string().min(1, "Brand is required"), // todo: get from api
    model: z.string().min(1, "Model is required"), // todo: get from api
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
    listingId,
});

export const ReviewListingSchema = z.object({
    listingId: listingId,
    status: z.nativeEnum(ListingStatusTypes),
    reviewComment: z.string().min(1, "Review comment is required"),
});

export const DashboardListingFilterSchema = z.object({
    Title: z.string().optional(),
    StartCreatedDate: z.string().optional(),
    EndCreatedDate: z.string().optional(),
    MinPrice: z.union([z.preprocess(Number, z.number().positive()), z.literal("")]).optional(),
    MaxPrice: z.union([z.preprocess(Number, z.number().positive()), z.literal("")]).optional(),
    City: z.string().optional(),
    Brand: z.string().optional(),
    Model: z.string().optional(),
    VehicleType: z.union([z.nativeEnum(VehicleTypes), z.literal("")]).optional(),
    FuelType: z.union([z.nativeEnum(FuelTypes), z.literal("")]).optional(),
    Condition: z.union([z.nativeEnum(VehicleConditionTypes), z.literal("")]).optional(),
    Transmission: z.union([z.nativeEnum(TransmissionTypes), z.literal("")]).optional(),
    ListingStatus: z.union([z.nativeEnum(ListingStatusTypes), z.literal("")]).optional(),
});
