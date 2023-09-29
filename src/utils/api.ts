import { getServerSession } from "next-auth/next";
import qs from "query-string";
import { authOptions, redirectToLoginPage } from "@/auth/authConfig";
import { env } from "@/env.mjs";
import {
    CreateListingReq,
    CreateSubscriptionReq,
    DashboardListFilterReq,
    DashboardMySubscriptionFilterReq,
    DashboardNotificationsFilterReq,
    DashboardSubscriptionFilterReq,
    EditListingReq,
    EditSubscriptionReq,
    ListingIdType,
    ListingItem,
    ListingItems,
    ListingSubscriptionIdType,
    ListingSubscriptionItem,
    ListingSubscriptionItems,
    MyListingsFilterReq,
    NotificationItems,
    PaginatedRequest,
    PaginatedResponse,
    PostedListingsFilterReq,
    ReportListingReq,
    ReviewListingReq,
    ToggleSubscriptionReq,
    UnListListingReq,
    VehicleBrand,
    VehicleFeature,
} from "./types";

const defaultReqHeaders = { "Content-Type": "application/json" };

const extractBadRequestError = (errors: { [key: string]: string[] }): string | void => {
    try {
        return Object.values(errors)
            .reduce((prev, current) => [...prev, current.join(", ")], [])
            .join(", ");
    } catch {
        console.error("Failed to parse bad request errors", errors);
    }
};

const fetchRequest = async <TResponse>(endpoint: string, config: RequestInit, withAuth = false): Promise<TResponse> => {
    let response: Response;
    if (withAuth) {
        const configWithAuth = await getConfigWithAuth(config);
        response = await fetch(`${env.API_BASE_URL}${endpoint}`, configWithAuth);
    } else {
        response = await fetch(`${env.API_BASE_URL}${endpoint}`, { ...config, headers: { ...config.headers, ...defaultReqHeaders } });
    }
    if (response.ok) {
        try {
            const responseJson = await response.json();
            return responseJson;
        } catch {
            return {} as TResponse;
        }
    } else {
        if (response.status === 401) {
            console.log("getting 401 for api call", endpoint);
            return redirectToLoginPage();
        }
        let errorResponse: any = "";
        const clonedResp = response.clone();
        const [jsonRes, textRes] = await Promise.allSettled([response.json(), clonedResp.text()]);
        if (jsonRes.status === "fulfilled") {
            errorResponse = jsonRes.value;
        } else if (textRes.status === "fulfilled") {
            errorResponse = textRes.value;
        }
        console.error("Fetch request failure:", errorResponse || response.statusText);
        const errorMessage = errorResponse?.title || errorResponse?.toString() || response.statusText || "Failure when calling the endpoint";
        if (response.status === 400 && errorResponse?.errors) {
            throw new Error(extractBadRequestError(errorResponse?.errors) || errorMessage);
        }
        throw new Error(`${errorMessage} (${response.status})`);
    }
};

const getConfigWithAuth = async (config: RequestInit = {}): Promise<RequestInit> => {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Session not found");
    }
    return { ...config, headers: { Authorization: `Bearer ${session?.access_token}`, ...defaultReqHeaders, ...config.headers } };
};

const fetchApi = {
    get: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchRequest<TResponse>(endpoint, config, false),
    post: <TBody extends BodyInit, TResponse>(endpoint: string, body: TBody, config: RequestInit = {}) =>
        fetchRequest<TResponse>(endpoint, { method: "POST", body, ...config }, false),
    protectedGet: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchRequest<TResponse>(endpoint, config, true),
    protectedPost: <TBody extends BodyInit, TResponse>(endpoint: string, body: TBody, config: RequestInit = {}) =>
        fetchRequest<TResponse>(endpoint, { method: "POST", body, ...config }, true),
    protectedPut: <TBody extends BodyInit, TResponse>(endpoint: string, body: TBody, config: RequestInit = {}) =>
        fetchRequest<TResponse>(endpoint, { method: "PUT", body, ...config }, true),
    protectedDelete: <TResponse>(endpoint: string, config: RequestInit = {}) =>
        fetchRequest<TResponse>(endpoint, { method: "DELETE", ...config }, true),
};

export const api = {
    getFeaturesList: () =>
        fetchApi.get<VehicleFeature[]>("/v1/Vehicles/features", { next: { tags: [apiTags.getFeaturesList()], revalidate: revalidationTime.oneDay } }),
    getVehicleBrands: () =>
        fetchApi.get<VehicleBrand[]>("/v1/Vehicles/brands", { next: { tags: [apiTags.getVehicleBrands()], revalidate: revalidationTime.oneDay } }),
    getVehicleModels: (brandId: string) =>
        fetchApi.get<VehicleFeature[]>(`/v1/Vehicles/${brandId}/models`, {
            next: { tags: [apiTags.getVehicleModels()], revalidate: revalidationTime.oneDay },
        }),
    getPostedListings: (req?: PaginatedRequest & PostedListingsFilterReq) =>
        fetchApi.get<PaginatedResponse & ListingItems>(`/v1/Listings/posted?${qs.stringify(req ?? {}, { skipEmptyString: true })}`, {
            next: { revalidate: revalidationTime.thirtyMins, tags: [apiTags.getPostedListings()] },
        }),
    getPostedListingItem: (id: ListingIdType) =>
        fetchApi.get<ListingItem>(`/v1/Listings/posted/${id}`, {
            next: { tags: [apiTags.getPostedListingItem(id)], revalidate: revalidationTime.oneDay },
        }),
    getRelatedListings: (id: ListingIdType) =>
        fetchApi.get<ListingItem[]>(`/v1/Listings/${id}/related-listings`, {
            next: { tags: [apiTags.getRelatedListings(id)], revalidate: revalidationTime.twelveHours },
        }),
    postListing: (body: CreateListingReq) => fetchApi.protectedPost<BodyInit, ListingIdType>("/v1/Listings", JSON.stringify(body)),
    putListing: (body: EditListingReq) => fetchApi.protectedPut<BodyInit, void>(`/v1/Listings/${body.listingId}`, JSON.stringify(body)),
    getListings: (req?: PaginatedRequest & DashboardListFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & ListingItems>(`/v1/Listings?${qs.stringify(req ?? {}, { skipEmptyString: true })}`, {
            next: { tags: [apiTags.getListings()], revalidate: revalidationTime.oneDay },
        }),
    getFeaturedListings: () =>
        fetchApi.get<ListingItem[]>("/v1/Listings/featured-listings", {
            next: { tags: [apiTags.getFeaturedListings()], revalidate: revalidationTime.twelveHours },
        }),
    getMyListings: (listingUserId: string, req?: PaginatedRequest & MyListingsFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & ListingItems>(`/v1/Users/me/listings?${qs.stringify(req ?? {}, { skipEmptyString: true })}`, {
            next: { tags: [apiTags.getMyListings(listingUserId)], revalidate: revalidationTime.oneDay },
        }),
    getListingsItem: (id: ListingIdType) =>
        fetchApi.protectedGet<ListingItem>(`/v1/Listings/${id}`, {
            next: { tags: [apiTags.getListingsItem(id)], revalidate: revalidationTime.oneDay },
        }),
    getMyListingsItem: (id: ListingIdType) =>
        fetchApi.protectedGet<ListingItem>(`/v1/Users/me/listings/${id}`, {
            next: { tags: [apiTags.getMyListingsItem(id)], revalidate: revalidationTime.oneDay },
        }),
    deleteListing: (listingId: ListingIdType) => fetchApi.protectedDelete<void>(`/v1/Listings/${listingId}`),
    reviewListing: (body: ReviewListingReq) => fetchApi.protectedPost<BodyInit, void>(`/v1/Listings/${body.listingId}/review`, JSON.stringify(body)),
    unListListing: (body: UnListListingReq) => fetchApi.protectedPost<BodyInit, void>(`/v1/Listings/${body.listingId}/unlist`, JSON.stringify(body)),
    renewListing: (listingId: ListingIdType) => fetchApi.protectedPost<BodyInit, void>(`/v1/Listings/${listingId}/renew`, JSON.stringify({})),
    incrementViews: (listingId: ListingIdType) =>
        fetchApi.post<BodyInit, void>(`/v1/Listings/${listingId}/increment-views`, "", { next: { revalidate: revalidationTime.noCache } }),
    reportListing: (body: ReportListingReq) => fetchApi.post<BodyInit, void>(`/v1/Listings/${body.listingId}/report`, JSON.stringify(body)),
    postListingSubscription: (body: CreateSubscriptionReq) =>
        fetchApi.protectedPost<BodyInit, ListingSubscriptionIdType>("/v1/ListingSubscriptions", JSON.stringify(body)),
    putListingSubscription: (body: EditSubscriptionReq) =>
        fetchApi.protectedPut<BodyInit, void>(`/v1/ListingSubscriptions/${body.listingSubscriptionId}`, JSON.stringify(body)),
    getListingSubscriptions: (req?: PaginatedRequest & DashboardSubscriptionFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & ListingSubscriptionItems>(
            `/v1/ListingSubscriptions?${qs.stringify(req ?? {}, { skipEmptyString: true })}`,
            { next: { tags: [apiTags.getListingSubscriptions()], revalidate: revalidationTime.oneDay } },
        ),
    getMyListingSubscriptions: (listingUserId: string, req?: PaginatedRequest & DashboardMySubscriptionFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & ListingSubscriptionItems>(
            `/v1/Users/me/listing-subscriptions?${qs.stringify(req ?? {}, { skipEmptyString: true })}`,
            { next: { tags: [apiTags.getMyListingSubscriptions(listingUserId)], revalidate: revalidationTime.oneDay } },
        ),
    getListingSubscriptionItem: (id: ListingIdType) =>
        fetchApi.protectedGet<ListingSubscriptionItem>(`/v1/ListingSubscriptions/${id}`, {
            next: { tags: [apiTags.getListingSubscriptionItem(id)], revalidate: revalidationTime.oneDay },
        }),
    getMyListingSubscriptionItem: (id: ListingIdType) =>
        fetchApi.protectedGet<ListingSubscriptionItem>(`/v1/Users/me/listing-subscriptions/${id}`, {
            next: { tags: [apiTags.getMyListingSubscriptionItem(id)], revalidate: revalidationTime.oneDay },
        }),
    deleteListingSubscriptions: (id: ListingSubscriptionIdType) => fetchApi.protectedDelete<void>(`/v1/ListingSubscriptions/${id}`),
    toggleListingSubscription: (body: ToggleSubscriptionReq) =>
        fetchApi.protectedPost<BodyInit, string>(`/v1/ListingSubscriptions/${body.listingSubscriptionId}/toggle-activation`, JSON.stringify(body)),
    getMyNotifications: (listingUserId: string, req?: PaginatedRequest & DashboardNotificationsFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & NotificationItems>(
            `/v1/Users/me/notifications?${qs.stringify(req ?? {}, { skipEmptyString: true })}`,
            { next: { tags: [apiTags.getMyNotifications(listingUserId)], revalidate: revalidationTime.threeHours } },
        ),
    setAllNotificationsAsShown: () => fetchApi.protectedPost<BodyInit, void>(`/v1/Users/me/notifications/set-all-shown`, ""),
};

export const apiTags = {
    getFeaturesList: () => "get-features-list",
    getVehicleBrands: () => "get-vehicle-brands",
    getVehicleModels: () => "get-vehicle-models",
    getFeaturedListings: () => "get-featured-listings",
    getPostedListings: () => "get-posted-listings",
    getPostedListingItem: (id: ListingIdType) => `get-posted-listing-item-${id}`,
    getRelatedListings: (id: ListingIdType) => `get-related-listing-item-${id}`,
    getListings: () => `get-admin-listings`,
    getMyListings: (listingUserId: string) => `get-my-listings-${listingUserId}`,
    getListingsItem: (id: ListingIdType) => `get-listing-item-${id}`,
    getMyListingsItem: (id: ListingIdType) => `get-my-listing-item-${id}`,
    getListingSubscriptions: () => `get-admin-listing-subscriptions`,
    getMyListingSubscriptions: (listingUserId: string) => `get-my-listing-subscriptions-${listingUserId}`,
    getListingSubscriptionItem: (id: ListingSubscriptionIdType) => `get-listing-subscription-item-${id}`,
    getMyListingSubscriptionItem: (id: ListingSubscriptionIdType) => `get-my-listing-subscription-item-${id}`,
    getMyNotifications: (listingUserId: string) => `get-my-notifications-${listingUserId}`,
};

export const listingItemTags = (id: ListingIdType, listingUserId: string) => [
    apiTags.getPostedListingItem(id),
    apiTags.getRelatedListings(id),
    apiTags.getMyListings(listingUserId),
    apiTags.getMyListingsItem(id),
    apiTags.getListings(),
    apiTags.getListingsItem(id),
];

export const subscriptionApiTags = (id: ListingSubscriptionIdType, listingUserId: string) => [
    apiTags.getListingSubscriptions(),
    apiTags.getListingSubscriptionItem(id),
    apiTags.getMyListingSubscriptions(listingUserId),
    apiTags.getMyListingSubscriptionItem(id),
];

const revalidationTime = {
    noCache: 0,
    fifteenMins: 900,
    thirtyMins: 1800,
    oneHour: 3600,
    threeHours: 10800,
    sixHours: 21600,
    twelveHours: 43200,
    oneDay: 86400,
};
