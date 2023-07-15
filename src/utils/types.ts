export type PaginatedResponse = {
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
};

type Price = {
    amount: number;
    currency: string;
    isPriceNegotiable?: boolean;
};

type Location = {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
};

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

type VehicleImage = {
    id: number;
    name: string;
    url: string;
    color: string;
    isThumbnail: boolean;
};

type VehicleFeature = {
    id: number;
    name: string;
};

type Vehicle = {
    id: number;
    type: string;
    brand: string;
    model: string;
    trim: string;
    yearOfManufacture: string;
    yearOfRegistration: string;
    millage: number;
    condition: string; // todo: add enum
    transmission: string; // todo: add enum
    fuelType: string; // todo: add enum
    engineCapacity: string;
    vehicleImages: VehicleImage[];
    features: VehicleFeature[];
};

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

export type ListingItems = { items: ListingItem[] };
