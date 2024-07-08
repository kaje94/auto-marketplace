"use server";
import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { unstable_cache } from "next/cache";
import { LocationsService } from "targabay-protos/gen/ts/dist/locations.v1_connect";
import { GetCitiesResponse, GetStatesResponse } from "targabay-protos/gen/ts/dist/types/locations_pb";
import { apiTags, grpcOptions, revalidationTime } from "@/utils/grpc";

const client = createPromiseClient(LocationsService, createGrpcTransport(grpcOptions));

/** Get states for a given country code */
export const getStatesOfCountry = async (countryCode: string) => {
    const getStates = unstable_cache(
        async (countryCode: string) => {
            const response = await client.getStates({ countryCode });
            return response.toJson() as any as GetStatesResponse;
        },
        [`${apiTags.getStates()}-${countryCode}`],
        { tags: [apiTags.getStates()], revalidate: revalidationTime.oneWeek },
    );
    return getStates(countryCode);
};

/** Get list of cities for a given country */
export const getCitiesOfState = async (stateCode: string) => {
    const getCities = unstable_cache(
        async (stateCode: string) => {
            const response = await client.getCities({ stateCode });
            return response.toJson() as any as GetCitiesResponse;
        },
        [`${apiTags.getCities()}-${stateCode}`],
        { tags: [apiTags.getCities()], revalidate: revalidationTime.oneWeek },
    );
    return getCities(stateCode);
};
