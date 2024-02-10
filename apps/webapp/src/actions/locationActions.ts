"use server";
import { api } from "@/utils/api";

/** Get states for a given country code */
export const getStatesOfCountry = async (countryCode: string) => api.getStates(countryCode);

/** Get cities of a state within a country */
export const getCitiesOfState = async (countryCode: string, stateCode: string) => api.getCities(countryCode, stateCode);
