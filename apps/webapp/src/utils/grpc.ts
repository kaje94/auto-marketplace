import { getAccessToken } from "@auth0/nextjs-auth0";
import { GrpcTransportOptions } from "@connectrpc/connect-node";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/env.mjs";
import { ListingIdType, ListingSubscriptionIdType } from "./types";

const getConfigWithAuth = async (): Promise<string> => {
    try {
        const { accessToken } = await getAccessToken();
        if (accessToken === undefined || accessToken === "") {
            throw new Error("Session not found");
        }
        return `Bearer ${accessToken}`;
    } catch (err) {
        const currentPathname = nextHeaders().get("x-pathname");
        redirect(`/unauthorized${currentPathname ? `?returnTo=${currentPathname}` : ``}`);
    }
};

export const grpcOptions: GrpcTransportOptions = { baseUrl: env.GRPC_API_BASE_URL, httpVersion: "2" };

export const getGrpcHeaders = async () => ({ Authorization: await getConfigWithAuth() });

const tagVersion = "v1_9";

export const apiTags = {
    getFeaturedListings: () => `get-featured-listings-${tagVersion}`,
    getFeatureListingsByCountry: (countryCode: string) => `get-featured-listings-country-${countryCode}-${tagVersion}`,
    getPostedListings: () => `get-posted-listings-${tagVersion}`,
    getPostedListingsByCountry: (countryCode: string) => `get-posted-listings-country-${countryCode}-${tagVersion}`,
    getPostedListingItem: (id: ListingIdType) => `get-posted-listing-item-${id}-${tagVersion}`,
    getRelatedListings: (id: ListingIdType) => `get-related-listing-item-${id}-${tagVersion}`,
    getListings: () => `get-admin-listings-${tagVersion}`,
    getMyListings: (userEmail: string) => `get-my-listings-${userEmail}-${tagVersion}`,
    getCanCreateListing: (userEmail: string) => `get-my-listings-can-create-${userEmail}-${tagVersion}`,
    getListingsItem: (id: ListingIdType) => `get-listing-item-${id}-${tagVersion}`,
    getAdminSubscriptions: () => `get-admin-subscriptions-${tagVersion}`,
    getUserSubscriptions: (userEmail: string) => `get-user-subscriptions-${userEmail}-${tagVersion}`,
    getCanCreateSubscriptions: (userEmail: string) => `get-user-subscriptions-can-create-${userEmail}-${tagVersion}`,
    getSubscriptionItem: (id: ListingSubscriptionIdType) => `get-subscription-item-${id}-${tagVersion}`,
    getMyNotifications: (userEmail: string) => `get-my-notifications-${userEmail}-${tagVersion}`,
    getMyProfileDetails: (userEmail: string) => `get-my-profile-${userEmail}-${tagVersion}`,
    getStates: () => `get-states-${tagVersion}`,
    getCities: () => `get-cities-${tagVersion}`,
};

export const listingItemTags = (id: ListingIdType, userEmail: string) => [
    apiTags.getPostedListingItem(id),
    apiTags.getRelatedListings(id),
    apiTags.getMyListings(userEmail),
    apiTags.getCanCreateListing(userEmail),
    apiTags.getListingsItem(id),
    apiTags.getListings(),
];

export const subscriptionApiTags = (id: ListingSubscriptionIdType, userEmail: string) => [
    apiTags.getAdminSubscriptions(),
    apiTags.getSubscriptionItem(id),
    apiTags.getUserSubscriptions(userEmail),
    apiTags.getCanCreateSubscriptions(userEmail),
];

export const revalidationTime = {
    noCache: false,
    fiveMins: 60 * 5,
    temMins: 60 * 10,
    fifteenMins: 60 * 15,
    thirtyMins: 60 * 30,
    oneHour: 60 * 60,
    threeHours: 60 * 60 * 3,
    sixHours: 60 * 60 * 6,
    twelveHours: 60 * 60 * 12,
    oneDay: 60 * 60 * 24,
    oneWeek: 60 * 60 * 24 * 7,
} as const;
