"use server";
import { api } from "@/utils/api";
import { Errors } from "@/utils/constants";
import { AddListingReq } from "@/utils/types";
import { redirect } from "next/navigation";

// const req: AddListingReq = {
//     description: "A best daily driver vehicle",
//     price: {
//         amount: 2345677,
//         currency: "LKR",
//         isPriceNegotiable: false,
//     },
//     hasOnGoingLease: false,
//     vehicle: {
//         type: "Car",
//         brand: "Honda",
//         model: "Fit GP5",
//         trim: "S Grade",
//         yearOfManufacture: "2015-01-01",
//         yearOfRegistration: "2016-03-23",
//         millage: 99000,
//         condition: "Registered",
//         transmission: "Automatic",
//         fuelType: "Hybrid",
//         engineCapacity: "1500",
//         vehicleImages: [
//             {
//                 name: "testimage",
//                 url: "testurls",
//                 color: "blue",
//                 isThumbnail: true,
//             },
//         ],
//         featureIds: [1, 2, 5],
//     },
//     location: {
//         street: "test street",
//         city: "Piliyandala",
//         state: "Western",
//         country: "LK",
//         postalCode: 33442,
//     },
// };

export const addAdvertAction = async (reqBody: AddListingReq) => {
    const listingId = await api.postListing(reqBody);
    console.log("created: ", listingId);
    return listingId;
};
