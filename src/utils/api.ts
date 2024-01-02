/* eslint-disable max-lines */
import { getAccessToken } from "@auth0/nextjs-auth0/edge";
import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import qs from "query-string";
import { env } from "@/env.mjs";
import {
    City,
    CreateListingReq,
    CreateSubscriptionReq,
    DashboardListFilterReq,
    DashboardMySubscriptionFilterReq,
    DashboardNotificationsFilterReq,
    DashboardSubscriptionFilterReq,
    DeleteS3ImagesReq,
    EditListingReq,
    EditSubscriptionReq,
    GenerateS3SignedUrlReq,
    GetPresignedS3UrlsResponse,
    ListingIdType,
    ListingItem,
    ListingItems,
    ListingSubscriptionIdType,
    ListingSubscriptionItem,
    ListingSubscriptionItems,
    ListingUser,
    MyListingsFilterReq,
    NotificationItems,
    PaginatedRequest,
    PaginatedResponse,
    PostedListingsFilterReq,
    ReportListingReq,
    ReviewListingReq,
    State,
    ToggleSubscriptionReq,
    UnListListingReq,
    UpdateProfileReq,
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

const fetchRequest = async <TResponse>(endpoint: string, config: RequestInit, withAuth = false, firstAttempt = true): Promise<TResponse> => {
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
            if (firstAttempt) {
                // Retry after 5 seconds
                await new Promise((resolve) => setTimeout(resolve, 5000));
                return fetchRequest(endpoint, config, withAuth, false);
            }
            const currentPathname = nextHeaders().get("x-pathname");
            redirect(`/unauthorized${currentPathname ? `?returnTo=${currentPathname}` : ``}`);
        }
        let errorResponse: any = "";
        const clonedResp = response.clone();
        const [jsonRes, textRes] = await Promise.allSettled([response.json(), clonedResp.text()]);
        if (jsonRes.status === "fulfilled") {
            errorResponse = jsonRes.value;
        } else if (textRes.status === "fulfilled") {
            errorResponse = textRes.value;
        }
        console.error(
            `\nFetch request failure for ${config.method || "GET"} ${endpoint} with a ${response.status} status code:`,
            errorResponse || response.statusText,
        );
        const errorMessage = errorResponse?.title || errorResponse?.toString() || response.statusText || "Failure when calling the endpoint";
        const truncatedErrorMessage = errorMessage?.substring(0, 500);
        if (response.status === 400 && errorResponse?.errors) {
            throw new Error(extractBadRequestError(errorResponse?.errors) || truncatedErrorMessage);
        }
        throw new Error(`${truncatedErrorMessage} (${response.status})`);
    }
};

const getConfigWithAuth = async (config: RequestInit = {}): Promise<RequestInit> => {
    try {
        const { accessToken } = await getAccessToken();
        if (!accessToken) {
            throw new Error("Session not found");
        }
        return { ...config, headers: { Authorization: `Bearer ${accessToken}`, ...defaultReqHeaders, ...config.headers } };
    } catch (err) {
        const currentPathname = nextHeaders().get("x-pathname");
        redirect(`/unauthorized${currentPathname ? `?returnTo=${currentPathname}` : ``}`);
    }
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
    protectedDelete: <TBody extends BodyInit, TResponse>(endpoint: string, body: TBody, config: RequestInit = {}) =>
        fetchRequest<TResponse>(endpoint, { method: "DELETE", body, ...config }, true),
};

export const api = {
    /** Get list of features for listing form and filters */
    getFeaturesList: () =>
        fetchApi.get<VehicleFeature[]>("/v1/Vehicles/features", {
            next: { tags: [apiTags.getFeaturesList()], revalidate: revalidationTime.oneWeek },
        }),
    /** Get vehicle brands for listing form and filters */
    getVehicleBrands: () =>
        fetchApi.get<VehicleBrand[]>("/v1/Vehicles/brands", { next: { tags: [apiTags.getVehicleBrands()], revalidate: revalidationTime.oneWeek } }),
    /** Get posted publicly visible listings */
    getPostedListings: (locale: string, req?: PaginatedRequest & PostedListingsFilterReq) =>
        fetchApi.get<PaginatedResponse & ListingItems>(`/v1/Listings/posted/${locale}?${qs.stringify(req ?? {}, { skipEmptyString: true })}`, {
            next: { revalidate: revalidationTime.thirtyMins, tags: [apiTags.getPostedListings(), apiTags.getPostedListingsByCountry(locale)] },
        }),
    /** Get details of a publicly posted listing items */
    getPostedListingItem: (id: ListingIdType) =>
        fetchApi.get<ListingItem>(`/v1/Listings/posted/${id}`, {
            next: { tags: [apiTags.getPostedListingItem(id)], revalidate: revalidationTime.oneDay },
        }),
    /** Get related listings of a publicly posted listing items */
    getRelatedListings: (id: ListingIdType) =>
        fetchApi.get<ListingItem[]>(`/v1/Listings/${id}/related-listings`, {
            next: { tags: [apiTags.getRelatedListings(id)], revalidate: revalidationTime.twelveHours },
        }),
    /** Post a new listing items */
    postListing: (body: CreateListingReq) => fetchApi.protectedPost<BodyInit, ListingIdType>("/v1/Listings", JSON.stringify(body)),
    /** Update a listing items. Can be performed by author or admin */
    putListing: (body: EditListingReq) => fetchApi.protectedPut<BodyInit, void>(`/v1/Listings/${body.listingId}`, JSON.stringify(body)),
    /** Delete a listing admin. Can be performed by author or admin */
    getListings: (req?: PaginatedRequest & DashboardListFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & ListingItems>(`/v1/Listings?${qs.stringify(req ?? {}, { skipEmptyString: true })}`, {
            next: { tags: [apiTags.getListings()], revalidate: revalidationTime.oneDay },
        }),
    /** Get featured listings within a country */
    getFeaturedListings: (countryCode: string) =>
        fetchApi.get<ListingItem[]>(`/v1/Listings/featured-listings/${countryCode}`, {
            next: {
                tags: [apiTags.getFeaturedListings(), apiTags.getFeatureListingsByCountry(countryCode)],
                revalidate: revalidationTime.twelveHours,
            },
        }),
    /** Get all listings created by the user */
    getMyListings: (listingUserId: string, req?: PaginatedRequest & MyListingsFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & ListingItems>(`/v1/Users/me/listings?${qs.stringify(req ?? {}, { skipEmptyString: true })}`, {
            next: { tags: [apiTags.getMyListings(listingUserId)], revalidate: revalidationTime.oneDay },
        }),
    /** Get details of an individual listing item. To be used by admins */
    getListingsItem: (id: ListingIdType) =>
        fetchApi.protectedGet<ListingItem>(`/v1/Listings/${id}`, {
            next: { tags: [apiTags.getListingsItem(id)], revalidate: revalidationTime.oneDay },
        }),
    /** Get details of a listing item by author who created it */
    getMyListingsItem: (id: ListingIdType) =>
        fetchApi.protectedGet<ListingItem>(`/v1/Users/me/listings/${id}`, {
            next: { tags: [apiTags.getMyListingsItem(id)], revalidate: revalidationTime.oneDay },
        }),
    /** Delete a listing item permanently. To be performed only by admins */
    deleteListing: (listingId: ListingIdType) => fetchApi.protectedDelete<BodyInit, void>(`/v1/Listings/${listingId}`, JSON.stringify({})),
    /** Accept or reject a newly created listing. To be performed only by admins */
    reviewListing: (body: ReviewListingReq) => fetchApi.protectedPost<BodyInit, void>(`/v1/Listings/${body.listingId}/review`, JSON.stringify(body)),
    /** Temporarily or permanently un-list a listing items */
    unListListing: (body: UnListListingReq) => fetchApi.protectedPost<BodyInit, void>(`/v1/Listings/${body.listingId}/unlist`, JSON.stringify(body)),
    /** Renew an expired advert or an advert that is about to be expired */
    renewListing: (listingId: ListingIdType) => fetchApi.protectedPost<BodyInit, void>(`/v1/Listings/${listingId}/renew`, JSON.stringify({})),
    /** Mark a listing advert as featured. */
    makeListingFeatured: (listingId: ListingIdType, countryCode: string) =>
        fetchApi.protectedPost<BodyInit, void>(`/v1/Listings/featured-listings/${countryCode}/${listingId}`, JSON.stringify({})),
    /** Increment the number of times, a listing has been viewed */
    incrementViews: (listingId: ListingIdType) =>
        fetchApi.post<BodyInit, void>(`/v1/Listings/${listingId}/increment-views`, "", { next: { revalidate: revalidationTime.noCache } }),
    /** Report a publicly posted listing */
    reportListing: (body: ReportListingReq) => fetchApi.post<BodyInit, void>(`/v1/Listings/${body.listingId}/report`, JSON.stringify(body)),
    /** Create a new listing subscription */
    postListingSubscription: (body: CreateSubscriptionReq) =>
        fetchApi.protectedPost<BodyInit, ListingSubscriptionIdType>("/v1/ListingSubscriptions", JSON.stringify(body)),
    /** Update an existing listing subscription */
    putListingSubscription: (body: EditSubscriptionReq) =>
        fetchApi.protectedPut<BodyInit, void>(`/v1/ListingSubscriptions/${body.listingSubscriptionId}`, JSON.stringify(body)),
    /** Get an individual listing subscription item */
    getListingSubscriptions: (req?: PaginatedRequest & DashboardSubscriptionFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & ListingSubscriptionItems>(
            `/v1/ListingSubscriptions?${qs.stringify(req ?? {}, { skipEmptyString: true })}`,
            { next: { tags: [apiTags.getListingSubscriptions()], revalidate: revalidationTime.oneDay } },
        ),
    /** Get all the listing subscription item created by the user */
    getMyListingSubscriptions: (listingUserId: string, req?: PaginatedRequest & DashboardMySubscriptionFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & ListingSubscriptionItems>(
            `/v1/Users/me/listing-subscriptions?${qs.stringify(req ?? {}, { skipEmptyString: true })}`,
            { next: { tags: [apiTags.getMyListingSubscriptions(listingUserId)], revalidate: revalidationTime.oneDay } },
        ),
    /** Get details of an individual subscription item. To be used by admins */
    getListingSubscriptionItem: (id: ListingIdType) =>
        fetchApi.protectedGet<ListingSubscriptionItem>(`/v1/ListingSubscriptions/${id}`, {
            next: { tags: [apiTags.getListingSubscriptionItem(id)], revalidate: revalidationTime.oneDay },
        }),
    /** Get details of an individual subscription item. To be used by author */
    getMyListingSubscriptionItem: (id: ListingIdType) =>
        fetchApi.protectedGet<ListingSubscriptionItem>(`/v1/Users/me/listing-subscriptions/${id}`, {
            next: { tags: [apiTags.getMyListingSubscriptionItem(id)], revalidate: revalidationTime.oneDay },
        }),
    /** Delete a listing subscription item */
    deleteListingSubscriptions: (id: ListingSubscriptionIdType) =>
        fetchApi.protectedDelete<BodyInit, void>(`/v1/ListingSubscriptions/${id}`, JSON.stringify({})),
    /** Toggle listing subscription as active or inactive */
    toggleListingSubscription: (body: ToggleSubscriptionReq) =>
        fetchApi.protectedPost<BodyInit, string>(`/v1/ListingSubscriptions/${body.listingSubscriptionId}/toggle-activation`, JSON.stringify(body)),
    /** Get all notifications of the logged in user */
    getMyNotifications: (listingUserId: string, req?: PaginatedRequest & DashboardNotificationsFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & NotificationItems>(
            `/v1/Users/me/notifications?${qs.stringify(req ?? {}, { skipEmptyString: true })}`,
            { next: { tags: [apiTags.getMyNotifications(listingUserId)], revalidate: revalidationTime.threeHours } },
        ),
    /** Mark all notifications as seen */
    setAllNotificationsAsShown: () => fetchApi.protectedPost<BodyInit, void>(`/v1/Users/me/notifications/set-all-shown`, ""),
    /** Get profile details of the logged in user */
    getMyProfileDetails: (userId: string) =>
        fetchApi.protectedGet<ListingUser>(`/v1/Users/${userId}`, {
            next: { tags: [apiTags.getMyProfileDetails(userId)], revalidate: revalidationTime.oneDay },
        }),
    /** Update the profile details of the logged in user */
    updateMyProfileDetails: (body: UpdateProfileReq) => fetchApi.protectedPut<BodyInit, void>(`/v1/Users/${body.userId}`, JSON.stringify(body)),
    /** Close the account of the logged in user */
    closeUserAccount: (userId: string) => fetchApi.protectedDelete<BodyInit, void>(`/v1/Users/${userId}/close-account`, JSON.stringify({})),
    /** Get states of a given country */
    getStates: (countryCode: string) =>
        fetchApi.get<State[]>(`/v1/Locations/countries/${countryCode}/states`, {
            next: { tags: [apiTags.getStates()], revalidate: revalidationTime.oneWeek },
        }),
    /** Get cities within a state within a country */
    getCities: (countryCode: string, stateCode: string) =>
        fetchApi.get<City[]>(`/v1/Locations/countries/${countryCode}/states/${stateCode}/cities`, {
            next: { tags: [apiTags.getCities()], revalidate: revalidationTime.oneWeek },
        }),
    /** Generate sign urls in order to upload listing image to S3 */
    generateS3SignedUrls: (body: GenerateS3SignedUrlReq) =>
        fetchApi.protectedPost<BodyInit, GetPresignedS3UrlsResponse>(`/v1/Images/generate-signed-urls`, JSON.stringify(body)),
    /** Delete an image from AWS S3 */
    deleteS3Image: (body: DeleteS3ImagesReq) => fetchApi.protectedDelete<BodyInit, void>(`/v1/Images/delete`, JSON.stringify(body)),
};

export const apiTags = {
    getFeaturesList: () => "get-features-list",
    getVehicleBrands: () => "get-vehicle-brands",
    getFeaturedListings: () => "get-featured-listings",
    getFeatureListingsByCountry: (countryCode: string) => `get-featured-listings-country-${countryCode}`,
    getPostedListings: () => "get-posted-listings",
    getPostedListingsByCountry: (countryCode: string) => `get-posted-listings-country-${countryCode}`,
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
    getMyProfileDetails: (userId: string) => `get-my-profile-${userId}`,
    getStates: () => `get-states`,
    getCities: () => `get-cities`,
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
    fifteenMins: 60 * 15,
    thirtyMins: 60 * 30,
    oneHour: 60 * 60,
    threeHours: 60 * 60 * 3,
    sixHours: 60 * 60 * 6,
    twelveHours: 60 * 60 * 12,
    oneDay: 60 * 60 * 24,
    oneWeek: 60 * 60 * 24 * 7,
};
