import { Claims } from "@auth0/nextjs-auth0";
import {
    ListingItem,
    PaginatedResponse as PaginatedGrpcResponse,
    SubscriptionItem,
    UserProfile,
    UserProfile_ProfileData,
} from "targabay-protos/gen/ts/dist/types/common_pb";
import { NotificationItem } from "targabay-protos/gen/ts/dist/types/notifications_pb";
import {
    FuelTypes,
    ListingStatusTypes,
    NotificationTypes,
    SubscriptionFrequencies,
    TransmissionTypes,
    VehicleConditionTypes,
    VehicleTypes,
} from "./enum";
import { LabelValue, Location, VehicleImageType } from "./types";

export const mockProfilePic = "https://picsum.photos/id/64/200/200";

export const mockUserLocation: Location = { city: "Colombo", state: "Western Province", postalCode: "00001", country: "LK" };

export const mockProfileData: UserProfile = {
    email: "user@gmail.com",
    name: "FirstName LastName",
    picture: mockProfilePic,
    data: {
        city: "city",
        countryCode: "lk",
        phone: "0123456789",
        postalCode: "00234",
        state: "state",
        vehicleDealer: true,
    } as UserProfile_ProfileData,
} as UserProfile;

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
    data: {
        description: "asd",
        price: 1000000,
        type: VehicleTypes.Car,
        brand: "Alfa Romeo",
        model: "Swift",
        trim: "LA",
        condition: VehicleConditionTypes.BrandNew,
        transmissionType: TransmissionTypes.Automatic,
        fuelType: FuelTypes.Petrol,
        engineCapacity: 3222,
        vehicleImages: [mockVehicleImage1, mockVehicleImage2],
        features: ["Heated Seats", "Park Assist", "Power Mirror"],
        mileage: 2323,
        priceNegotiable: true,
        yearOfManufacture: 2010,
        yearOfRegistration: 2015,
    },
    status: ListingStatusTypes.Posted,
    expiryDate: "2024-01-17T12:37:40.268715+00:00",
    reviewComment: "",
    createdAt: "2023-12-17T12:37:40.502928+00:00",
    user: mockProfileData,
} as ListingItem;

export const paginatedResp: PaginatedGrpcResponse = {
    totalCount: 1,
    totalPages: 1,
} as PaginatedGrpcResponse;

export const paginatedEmptyResp: PaginatedGrpcResponse = {
    totalCount: 0,
    totalPages: 1,
} as PaginatedGrpcResponse;

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

export const mockSubscriptionItem: SubscriptionItem = {
    id: "4e9e7730-08eb-4ae2-b6d2-7b3955973813",
    active: true,
    createdAt: "2023-12-18T13:11:21.710954+00:00",
    data: {
        displayName: "Test Subscription",
        type: VehicleTypes.Car,
        brand: "Alfa Romeo",
        model: "Swift",
        trim: "LX",
        minYearOfManufacture: 2010,
        maxYearOfManufacture: 2020,
        minYearOfRegistration: 2015,
        maxYearOfRegistration: 2024,
        minMillage: 1000,
        maxMillage: 10000,
        condition: VehicleConditionTypes.BrandNew,
        minPrice: 50000,
        maxPrice: 150000,
        notificationFrequency: SubscriptionFrequencies.Daily,
        subscriptionExpiryDate: "2023-12-30T00:00:00+00:00",
    },
    user: mockProfileData,
} as SubscriptionItem;

export const mockNotificationItem: NotificationItem = {
    id: "4e9e7730-08eb-4ae2-b6d2-7b3955973813",
    body: "Notification message body",
    createdAt: "2023-12-18T13:11:21.710954+00:00",
    isShown: true,
    redirectPath: "",
    title: "Notification Title",
    type: NotificationTypes.ListingApproved,
} as NotificationItem;

export const mockLabelValue: LabelValue[] = [
    { label: "Option 1", value: "Option 1" },
    { label: "Option 2", value: "Option 2" },
    { label: "Option 3", value: "Option 3" },
];
