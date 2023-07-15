import { env } from "@/env.mjs";
import { headers } from "next/headers";
import { PaginatedResponse, ListingItems } from "./types";

const fetchRequest = async <TResponse>(url: string, config: RequestInit): Promise<TResponse> => {
    const response = await fetch(url, config);
    return await response.json();
};

const getConfigWithWith = (config: RequestInit = {}): RequestInit => {
    const Authorization = headers()?.get("authorization") || "";
    return { ...config, headers: { Authorization, ...config.headers } };
};

const fetchApi = {
    get: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchRequest<TResponse>(`${env.API_BASE_URL}${endpoint}`, config),
    protectedGet: <TResponse>(endpoint: string, config: RequestInit = {}) => fetchApi.get<TResponse>(endpoint, getConfigWithWith(config)),
    protectedPost: <TBody extends BodyInit, TResponse>(endpoint: string, body: TBody) =>
        fetchRequest<TResponse>(`${env.API_BASE_URL}${endpoint}`, getConfigWithWith({ method: "POST", body })),
};

export const api = {
    getPostedListings: () => fetchApi.get<PaginatedResponse & ListingItems>("/v1/Listings/posted"),
    // postListing: () => fetchApi.protectedPost<BodyType, ReponseType>("/v1/Listings"),
};
