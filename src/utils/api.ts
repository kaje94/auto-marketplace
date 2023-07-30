import { env } from "@/env.mjs";
import { headers } from "next/headers";
import { PaginatedResponse, ListingItems, AddListingReq, VehicleFeature, PaginatedRequest } from "./types";
import { Errors } from "./types";
import qs from "query-string";

const fetchRequest = async <TResponse>(url: string, config: RequestInit): Promise<TResponse> => {
    const response = await fetch(url, config);
    if (response.ok) {
        try {
            const responseJson = await response.json();
            return responseJson;
        } catch {
            return {} as TResponse;
        }
    } else {
        try {
            const badRes = await Promise.race([response.json(), response.text()]);
            console.error("Failure response:", badRes);
        } catch {
            console.error("Failed to parse failure response: ", response.statusText);
        }
        throw new Error(response.statusText || "Failure when calling the endpoint");
    }
};

const getConfigWithAuth = (config: RequestInit = {}): RequestInit => {
    const Authorization = headers()?.get("tokenHeader") || "";
    console.log("Authorization", Authorization);
    if (!Authorization) {
        throw new Error(Errors.Unauthorized);
    }
    return { ...config, headers: { Authorization, "Content-Type": "application/json", ...config.headers } };
};

const fetchApi = {
    get: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchRequest<TResponse>(`${env.API_BASE_URL}${endpoint}`, config),
    protectedGet: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchApi.get<TResponse>(endpoint, getConfigWithAuth(config)),
    protectedPost: <TBody extends BodyInit, TResponse>(endpoint: string, body: TBody, config: RequestInit = {}) =>
        fetchRequest<TResponse>(`${env.API_BASE_URL}${endpoint}`, getConfigWithAuth({ method: "POST", body, ...config })),
    protectedDelete: <TResponse>(endpoint: string, config: RequestInit = {}) =>
        fetchRequest<TResponse>(`${env.API_BASE_URL}${endpoint}`, getConfigWithAuth({ method: "DELETE", ...config })),
};

export const api = {
    getFeatureList: () => fetchApi.get<VehicleFeature[]>("/v1/Vehicles/features"),
    getPostedListings: () => fetchApi.get<PaginatedResponse & ListingItems>("/v1/Listings/posted"),
    postListing: (body: AddListingReq) => fetchApi.protectedPost<BodyInit, number>("/v1/Listings", JSON.stringify(body)),
    getMyListings: (req?: PaginatedRequest) => fetchApi.protectedGet<PaginatedResponse & ListingItems>(`/v1/Listings?${qs.stringify(req ?? {})}`),
    deleteListing: (listingId: number) => fetchApi.protectedDelete<void>(`/v1/Listings/${listingId}`),
};
