import { env } from "@/env.mjs";
import {
    PaginatedResponse,
    ListingItems,
    CreateListingReq,
    VehicleFeature,
    PaginatedRequest,
    ListingItem,
    ReviewListingReq,
    EditListingReq,
    DashboardListFilterReq,
} from "./types";
import qs from "query-string";
import { authOptions, redirectToLoginPage } from "@/auth/authConfig";
import { getServerSession } from "next-auth/next";

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
        response = await fetch(`${env.API_BASE_URL}${endpoint}`, config);
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
        throw new Error(errorMessage);
    }
};

const getConfigWithAuth = async (config: RequestInit = {}): Promise<RequestInit> => {
    let session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Session not found");
    }
    return { ...config, headers: { Authorization: `Bearer ${session?.access_token}`, "Content-Type": "application/json", ...config.headers } };
};

const fetchApi = {
    get: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchRequest<TResponse>(endpoint, config, false),
    protectedGet: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchRequest<TResponse>(endpoint, config, true),
    protectedPost: <TBody extends BodyInit, TResponse>(endpoint: string, body: TBody, config: RequestInit = {}) =>
        fetchRequest<TResponse>(endpoint, { method: "POST", body, ...config }, true),
    protectedPut: <TBody extends BodyInit, TResponse>(endpoint: string, body: TBody, config: RequestInit = {}) =>
        fetchRequest<TResponse>(endpoint, { method: "PUT", body, ...config }, true),
    protectedDelete: <TResponse>(endpoint: string, config: RequestInit = {}) =>
        fetchRequest<TResponse>(endpoint, { method: "DELETE", ...config }, true),
};

export const api = {
    // todo: fix caching strategy for all get endpoints
    // { next: { revalidate: 0 } } for disabling cache
    getFeatureList: () => fetchApi.get<VehicleFeature[]>("/v1/Vehicles/features"),
    getPostedListings: () => fetchApi.get<PaginatedResponse & ListingItems>("/v1/Listings/posted", { next: { revalidate: 0 } }),
    getPostedListingItem: (id: string | number) => fetchApi.get<ListingItem>(`/v1/Listings/posted/${id}`),
    getRelatedListings: (id: string | number) => fetchApi.get<ListingItem[]>(`/v1/Listings/${id}/related-listings`),
    postListing: (body: CreateListingReq) => fetchApi.protectedPost<BodyInit, number>("/v1/Listings", JSON.stringify(body)),
    putListing: (body: EditListingReq) => fetchApi.protectedPut<BodyInit, void>(`/v1/Listings/${body.listingId}`, JSON.stringify(body)),
    getListings: (req?: PaginatedRequest & DashboardListFilterReq) =>
        fetchApi.protectedGet<PaginatedResponse & ListingItems>(`/v1/Listings?${qs.stringify(req ?? {})}`),
    getListingsItem: (id: string | number) => fetchApi.protectedGet<ListingItem>(`/v1/Listings/${id}`),
    deleteListing: (listingId: number) => fetchApi.protectedDelete<void>(`/v1/Listings/${listingId}`),
    reviewListing: (body: ReviewListingReq) => fetchApi.protectedPost<BodyInit, void>(`/v1/Listings/${body.listingId}/review`, JSON.stringify(body)),
};
