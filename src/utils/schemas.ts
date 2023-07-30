import { z } from "zod";

export const PriceSchema = z.object({
    amount: z.preprocess(Number, z.number().min(1, "Price amount needs to be a positive number")),
    currency: z.string().default("LKR"),
    isPriceNegotiable: z.boolean().default(false),
});

export const LocationSchema = z.object({
    street: z.string().min(1, "Street is required"),
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
    file: z.instanceof(File).optional(),
    preview: z.string().optional(),
});

export const VehicleFeatureSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
});

const YearSchema = z.string().refine(
    (value) => {
        const numericValue = Number(value);
        return numericValue >= 1960 && numericValue <= new Date().getFullYear();
    },
    { message: `Year must be between 1960 and ${new Date().getFullYear()}` }
);

export const VehicleSchema = z.object({
    id: z.number().optional(),
    type: z.string().min(1, "Type is required"), // todo: add enum
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    trim: z.string().min(1, "Trim is required"),
    yearOfManufacture: YearSchema,
    yearOfRegistration: YearSchema,
    millage: z.preprocess(Number, z.number().min(1, "Milage needs to be a positive number")),
    condition: z.string().min(1, "Condition is required"), // todo: add enum
    transmission: z.string().min(1, "Transmission type is required"), // todo: add enum
    fuelType: z.string().min(1, "Fuel type is required"), // todo: add enum
    engineCapacity: z.string().min(1, "Engine capacity is required"),
    vehicleImages: z.array(VehicleImageSchema).min(1, "At least one image is required").max(10, "Cannot have more than 10 images"),
    features: z.array(VehicleFeatureSchema),
});

export const CreateListingSchema = z.object({
    description: z.string().min(1, "Description is required"),
    price: PriceSchema,
    hasOnGoingLease: z.boolean().default(false),
    location: LocationSchema,
    vehicle: VehicleSchema.omit({ features: true, id: true }).merge(z.object({ featureIds: z.array(z.number()) })),
});
