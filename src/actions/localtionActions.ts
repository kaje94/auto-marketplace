"use server";
import { api } from "@/utils/api";

export const getStatesOfCountry = async (countryCode: string) => api.getStates(countryCode);

export const getCitiesOfState = async (countryCode: string, stateCode: string) => api.getCities(countryCode, stateCode);
