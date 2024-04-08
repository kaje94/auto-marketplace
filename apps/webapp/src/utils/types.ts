import { PartialMessage } from "@bufbuild/protobuf";
import { UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { z } from "zod";
import { ListingStatusTypes, NotificationTypes, SubscriptionFrequencies, VehicleConditionTypes, VehicleTypes } from "./enum";
import {
    AdminListingsFilterSchema,
    AdminSubscriptionsFilterSchema,
    ContactUsSchema,
    CreateListingSchema,
    CreateSubscriptionSchema,
    DeleteS3Images,
    EditListingSchema,
    EditSubscriptionSchema,
    ListingIdField,
    ListingSubscriptionIdField,
    LocationSchema,
    MilageSchema,
    PriceSchema,
    PublicListingsFilterSchema,
    ToggleSubscriptionSchema,
    UpdateProfileSchema,
    UserListingsFilterSchema,
    UserNotificationsFilterSchema,
    UserSubscriptionsFilterSchema,
    vehicleCreateSchema,
    VehicleImageSchema,
    VehicleSchema,
} from "./schemas";

declare module "@auth0/nextjs-auth0" {
    interface Claims {
        email: string;
        email_verified: boolean;
        family_name: string;
        given_name: string;
        isAdmin?: boolean;
        locale: string;
        name: string;
        new_user?: boolean;
        nickname: string;
        picture: string;
        sid: string;
        sub: string;
        updated_at: string;
    }
}

export type KeyValue = { [key: string]: string };

export type LabelValue = {
    label: string;
    value: string | number;
};

type Price = z.infer<typeof PriceSchema>;

type Milage = z.infer<typeof MilageSchema>;

export type Location = z.infer<typeof LocationSchema>;

export type ListingUser = {
    address: null | {
        city?: string;
        country?: string;
        postalCode?: string;
        state?: string;
    };
    email: string;
    emailConfirmed: boolean;
    firstName: string;
    fullName: string;
    isDealership: boolean;
    lastName: string;
    phone: string;
    phoneConfirmed: boolean;
    picture: string;
    userId: string;
    userName: null | string;
};

export type Vehicle = z.infer<typeof VehicleSchema>;

export type NotificationItem = {
    body: string;
    createdOn: string;
    id: string;
    isShown: boolean;
    redirectUrl: string;
    title: string;
    type: NotificationTypes;
    userId: string;
};

export type GetPresignedS3UrlsResponse = {
    bucket: string;
    expiryTime: string;
    key: string;
    region: string;
    url: string;
}[];

export type Country = {
    countryCode: string;
    currency: string;
    emojiU: string;
    name: string;
    phoneCode: string;
    region: string;
};

export interface CountryMap {
    [key: string]: [name: string, currency: string, currencySymbol: string, phoneCode: string, flag: string];
}

export type SearchParams = { searchParams: { [key: string]: string | string[] | undefined } };

export type ChildrenProps = { children: React.ReactNode };

export type ErrorPageProps = { error: Error; reset: () => void };

export type ListingIdPathParam = { params: { id: ListingIdType } };

export type LocalePathParam = { params: { locale: string } };

export type SubscriptionIdPathParam = { params: { id: ListingSubscriptionIdType } };

export type VehicleImageType = z.infer<typeof VehicleImageSchema>;

export type VehicleCreate = z.infer<typeof vehicleCreateSchema>;

export type CreateListingReq = z.infer<typeof CreateListingSchema>;

export type CreateSubscriptionReq = z.infer<typeof CreateSubscriptionSchema>;

export type EditSubscriptionReq = z.infer<typeof EditSubscriptionSchema>;

export type EditListingReq = z.infer<typeof EditListingSchema>;

export type AdminListingsFilterReq = z.infer<typeof AdminListingsFilterSchema>;

export type UserSubscriptionsFilterReq = z.infer<typeof UserSubscriptionsFilterSchema>;

export type AdminSubscriptionsFilterReq = z.infer<typeof AdminSubscriptionsFilterSchema>;

export type UserListingsFilterReq = z.infer<typeof UserListingsFilterSchema>;

export type UserNotificationsFilterReq = z.infer<typeof UserNotificationsFilterSchema>;

export type PublicListingsFilterReq = z.infer<typeof PublicListingsFilterSchema>;

export type ListingIdType = z.infer<typeof ListingIdField>;

export type ListingSubscriptionIdType = z.infer<typeof ListingSubscriptionIdField>;

export type ToggleSubscriptionReq = z.infer<typeof ToggleSubscriptionSchema>;

export type UpdateProfileReq = z.infer<typeof UpdateProfileSchema>;

export type ContactUsSchemaReq = z.infer<typeof ContactUsSchema>;

export type DeleteS3ImagesReq = z.infer<typeof DeleteS3Images>;
