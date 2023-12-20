import { Claims } from "@auth0/nextjs-auth0/edge";
import {
    FuelTypes,
    ListingStatusTypes,
    NotificationTypes,
    SubscriptionFrequencies,
    TransmissionTypes,
    VehicleConditionTypes,
    VehicleTypes,
} from "./enum";
import {
    LabelValue,
    ListingItem,
    ListingItems,
    ListingSubscriptionItem,
    ListingSubscriptionItems,
    ListingUser,
    Location,
    NotificationItem,
    NotificationItems,
    PaginatedResponse,
    VehicleBrand,
    VehicleFeature,
    VehicleImageType,
} from "./types";

export const mockProfilePic = "https://picsum.photos/id/64/200/200";

export const mockUserLocation: Location = { city: "Colombo", state: "Western Province", postalCode: "00001", country: "LK" };

export const mockProfileData: ListingUser = {
    userId: "abc",
    firstName: "UserFirstName",
    lastName: "UserLastName",
    fullName: "FirstName LastName",
    picture: mockProfilePic,
    isDealership: false,
    address: mockUserLocation,
    userName: null,
    email: "user@gmail.com",
    phone: "0123456789",
    emailConfirmed: true,
    phoneConfirmed: true,
};

export const mockVehicleImage1: VehicleImageType = {
    id: "a510d79d-4f91-4423-b47d-8861ab93460a",
    name: "sample-image.webp",
    url: " ",
    color: "#8a8378",
    isThumbnail: true,
    hash: "XAgGFIKrgYYipHWAm4b3WK0/5w==",
    deleted: false,
};

export const mockVehicleImage2: VehicleImageType = {
    id: "02067d4d-d0eb-478f-8145-a79bda834b6c",
    name: "sample-image.webp",
    url: " ",
    color: "#6d7c80",
    isThumbnail: false,
    hash: "2ecNFQJHeWmJB5aniZuoV8itbx+o",
    deleted: false,
};

export const mockListingItem: ListingItem = {
    id: "19229351-d54d-44a8-b150-7310f5acf573",
    title: "Alfa Romeo Car1 LA 2023",
    description: "asd",
    price: { amount: `1000000`, currencyCode: "LKR", currencySymbol: "Rs", isPriceNegotiable: true },
    location: { city: "Colombo", state: "Colombo District", country: "LK", postalCode: "00001" },
    status: ListingStatusTypes.Posted,
    expiryDate: "2024-01-17T12:37:40.268715+00:00",
    reviewComment: "",
    vehicle: {
        id: "88b2fd88-b339-4f51-8884-278800f53602",
        type: VehicleTypes.Car,
        brand: "Alfa Romeo",
        model: "Swift",
        trim: "LA",
        yearOfManufacture: "2023-01-01T00:00:00+00:00",
        yearOfRegistration: "2023-01-01T00:00:00+00:00",
        millage: { unit: "km", distance: 2323 },
        condition: VehicleConditionTypes.BrandNew,
        transmission: TransmissionTypes.Automatic,
        fuelType: FuelTypes.Petrol,
        engineCapacity: 3222,
        vehicleImages: [mockVehicleImage1, mockVehicleImage2],
        features: [
            { id: "f4b61d2b-7927-419f-9661-518d1cd69cc5", name: "BREAK ASSIST" },
            { id: "1e53cb8f-cfc9-41a3-967d-84cedf1b2b88", name: "AIR CONDITIONING" },
            { id: "c5fe29f8-215a-46dd-bb15-41b735751321", name: "ADAPTIVE CRUISE CONTROL" },
            { id: "9bc1836f-eab2-41cc-88b1-36c4ede2a5ae", name: "4-WAY CAMERA" },
        ],
    },
    userId: "google-oauth2|102660616863297459617",
    createdOn: "2023-12-17T12:37:40.502928+00:00",
    views: 2,
    user: mockProfileData,
};

export const mockListingsResponse: PaginatedResponse & ListingItems = {
    items: [mockListingItem],
    pageNumber: 1,
    totalPages: 1,
    totalCount: 1,
    hasPreviousPage: false,
    hasNextPage: false,
};

export const mockEmptyListingsResponse: PaginatedResponse & ListingItems = {
    items: [],
    pageNumber: 1,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
};

export const mockUserClaims: Claims = {
    email: "user_email@gmail.com",
    email_verified: true,
    family_name: "userFamilyName",
    given_name: "userGivenName",
    isAdmin: true,
    locale: "en",
    name: "UserFirstName UserLastName",
    nickname: "userNickName",
    picture: "",
    sid: "",
    sub: "",
    updated_at: "",
    new_user: false,
};

export const mockSubscriptionItem: ListingSubscriptionItem = {
    id: "4e9e7730-08eb-4ae2-b6d2-7b3955973813",
    active: true,
    userId: "google-oauth2|102660616863297459617",
    displayName: "Test Subscription",
    type: VehicleTypes.Car,
    brand: "Alfa Romeo",
    model: "Swift",
    trim: "LX",
    minYearOfManufacture: "",
    maxYearOfManufacture: "",
    minYearOfRegistration: "",
    maxYearOfRegistration: "",
    minMillage: undefined,
    maxMillage: undefined,
    condition: VehicleConditionTypes.BrandNew,
    minPrice: undefined,
    maxPrice: undefined,
    notificationFrequency: SubscriptionFrequencies.OnceADay,
    subscriptionExpiryDate: "2023-12-30T00:00:00+00:00",
    createdOn: "2023-12-18T13:11:21.710954+00:00",
    user: undefined,
};

export const mockSubscriptionsResponse: PaginatedResponse & ListingSubscriptionItems = {
    items: [mockSubscriptionItem],
    pageNumber: 1,
    totalPages: 1,
    totalCount: 1,
    hasPreviousPage: false,
    hasNextPage: false,
};

export const mockEmptySubscriptionsResponse: PaginatedResponse & ListingSubscriptionItems = {
    items: [],
    pageNumber: 1,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
};

export const mockNotificationItem: NotificationItem = {
    id: "4e9e7730-08eb-4ae2-b6d2-7b3955973813",
    body: "Notification message body",
    createdOn: "2023-12-18T13:11:21.710954+00:00",
    isShown: true,
    redirectUrl: "",
    title: "Notification Title",
    userId: "",
    type: NotificationTypes.ListingApproved,
};

export const mockNotificationsResponse: PaginatedResponse & NotificationItems = {
    items: [mockNotificationItem],
    pageNumber: 1,
    totalPages: 1,
    totalCount: 1,
    hasPreviousPage: false,
    hasNextPage: false,
};

export const mockEmptyNotificationResponse: PaginatedResponse & NotificationItems = {
    items: [],
    pageNumber: 1,
    totalPages: 1,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
};

export const mockVehicleBrands: VehicleBrand[] = [
    { id: "68250ffd-ed61-42a1-9a79-28c0443438b4", name: "Acura" },
    { id: "b34385ee-764d-470a-881d-4c0577e96fcd", name: "Alfa Romeo" },
    { id: "998300b5-dbde-4828-baf5-08e5aabe617c", name: "Audi" },
    { id: "5e4731e1-1f4f-4140-b541-9866066da5e9", name: "BMW" },
    { id: "fc96a42a-3119-4fc9-b8bb-9b48ba3baa65", name: "Bajaj" },
    { id: "a713b232-d9ae-47c5-99d8-369b58be4fdf", name: "Bugatti" },
    { id: "5a37909d-c6f6-4ad8-afa6-7260dde96e3b", name: "Chevrolet" },
    { id: "7c0e2f27-de95-4cac-b275-ef3f17ddb7bc", name: "Daihatsu" },
    { id: "2d86c50c-74f4-4940-a0bd-33863821dc21", name: "Ferrari" },
    { id: "613ea881-877e-4b4c-9ca3-1e5fd85d580e", name: "Fiat" },
];

export const mockVehicleFeatures: VehicleFeature[] = [
    { id: "9bc1836f-eab2-41cc-88b1-36c4ede2a5ae", name: "4-WAY CAMERA" },
    { id: "c5fe29f8-215a-46dd-bb15-41b735751321", name: "ADAPTIVE CRUISE CONTROL" },
    { id: "1e53cb8f-cfc9-41a3-967d-84cedf1b2b88", name: "AIR CONDITIONING" },
    { id: "f4b61d2b-7927-419f-9661-518d1cd69cc5", name: "BREAK ASSIST" },
    { id: "0ada54e3-0b61-45c4-ab3c-a32ffe54b267", name: "DUAL AIR CONDITIONING" },
    { id: "1ae7fbff-d4e8-419b-a2d5-2d58cdaa8c9a", name: "ELECTRIC SEATS" },
    { id: "bf2f0bab-949c-46b2-a781-ab8fb2b12764", name: "HEATED SEATS" },
    { id: "a4518e0b-a87a-427c-8789-5a368a24054a", name: "LANE ASSIST" },
    { id: "96ed8a4a-6258-4e24-bad2-05324a8b4a89", name: "MEMORY SEATS" },
    { id: "10bfff2c-f88a-42d1-9e0b-533cca09ca35", name: "PARK ASSIST" },
    { id: "f045f8d9-449b-4d48-a53c-737b6908ecac", name: "POWER MIRROR" },
    { id: "fbbc5463-be51-4031-8212-4e11899af3f1", name: "POWER STEERING" },
    { id: "bc5ead3a-36b9-4f02-8940-f2135890b8fc", name: "POWER STEERING" },
    { id: "ce45d8b7-e8b7-44e6-abd5-f7c586f4ec93", name: "POWER WINDOW" },
    { id: "1a4e0610-84bf-41ea-be6a-2ece31bcf147", name: "PUSH START" },
    { id: "713341f8-8d63-4fd1-bdde-9d79dbb35cf5", name: "REVERSE CAMERA" },
    { id: "2a050c94-f582-412f-91cc-83fa62055963", name: "SRS AIR BAGS" },
    { id: "cc1c1448-9588-4f1b-ad55-3681d370131c", name: "SUNROOF" },
    { id: "f6063c20-f184-4ca8-8f0a-8139a1ba1dda", name: "TRACTION CONTROL" },
    { id: "ce66066e-b3af-48d7-8ff7-6711c0b6ac3d", name: "WINKER MIRRORS" },
];

export const mockLabelValue: LabelValue[] = [
    { label: "Option 1", value: "Option 1" },
    { label: "Option 2", value: "Option 2" },
    { label: "Option 3", value: "Option 3" },
];
