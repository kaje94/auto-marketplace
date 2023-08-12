import { env } from "@/env.mjs";
import { PaginatedResponse, ListingItems, AddListingReq, VehicleFeature, PaginatedRequest, ListingItem } from "./types";
import qs from "query-string";
import { authOptions, redirectToLoginPage } from "@/auth/authConfig";
import { getServerSession } from "next-auth/next";

const fetchRequest = async <TResponse>(endpoint: string, config: RequestInit, withAuth = false): Promise<TResponse> => {
    let response: Response;
    const configWithAuth = await getConfigWithAuth(config);
    if (withAuth) {
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
        let errorResponse = "";
        const [jsonRes, textRes] = await Promise.allSettled([response.json(), response.text()]);
        if (jsonRes.status === "fulfilled") {
            errorResponse = jsonRes.value;
        } else if (textRes.status === "fulfilled") {
            errorResponse = textRes.value;
        }
        console.error("Fetch request failure:", errorResponse || response.statusText);
        throw new Error(errorResponse || response.statusText || "Failure when calling the endpoint");
    }
};

const getConfigWithAuth = async (config: RequestInit = {}): Promise<RequestInit> => {
    let session = await getServerSession(authOptions);
    if (session?.access_token) {
        return { ...config, headers: { Authorization: `Bearer ${session?.access_token}`, "Content-Type": "application/json", ...config.headers } };
    }
    return { ...config, headers: { "Content-Type": "application/json", ...config.headers } };
};

const fetchApi = {
    get: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchRequest<TResponse>(endpoint, config, false),
    protectedGet: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchRequest<TResponse>(endpoint, config, true),
    protectedPost: <TBody extends BodyInit, TResponse>(endpoint: string, body: TBody, config: RequestInit = {}) =>
        fetchRequest<TResponse>(endpoint, { method: "POST", body, ...config }, true),
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
    postListing: (body: AddListingReq) => fetchApi.protectedPost<BodyInit, number>("/v1/Listings", JSON.stringify(body)),
    getMyListings: (req?: PaginatedRequest) => fetchApi.protectedGet<PaginatedResponse & ListingItems>(`/v1/Listings?${qs.stringify(req ?? {})}`),
    deleteListing: (listingId: number) => fetchApi.protectedDelete<void>(`/v1/Listings/${listingId}`),
};
