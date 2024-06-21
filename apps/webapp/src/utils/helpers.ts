import { PartialMessage } from "@bufbuild/protobuf";
import { ListingItem_Data, UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { Location, Vehicle, VehicleCreate } from "./types";

/** Convert date object into a human friendly date string */
export const formatHumanFriendlyDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
};

/** Convert vehicle object into a title similar to how the backend title is generated */
export const getListingTitleFromVehicle = (vehicle: Vehicle | VehicleCreate) => {
    if (vehicle.trim) {
        return `${vehicle.brand} ${vehicle.model} ${vehicle.trim} ${vehicle.yearOfManufacture}`;
    }
    return `${vehicle.brand} ${vehicle.model} ${vehicle.yearOfManufacture}`;
};

/** Convert vehicle object into a title similar to how the backend title is generated */
export const getListingTitleFromListing = (listingItemData: ListingItem_Data) => {
    const items: string[] = [];
    if (listingItemData?.brand && listingItemData?.brand?.toLowerCase() !== "other") {
        items.push(listingItemData?.brand);
    }
    if (listingItemData?.model) {
        items.push(listingItemData.model);
    }
    if (listingItemData?.trim) {
        items.push(listingItemData.trim);
    }
    if (listingItemData?.yearOfManufacture) {
        items.push(`${listingItemData.yearOfManufacture}`);
    }
    return items.join(" ");
};

export const getLocationUserProfile = (listingUser: UserProfile): Location => {
    return {
        city: listingUser?.data?.city!,
        state: listingUser?.data?.state!,
        postalCode: listingUser?.data?.postalCode!,
        country: listingUser?.data?.countryCode!,
    };
};

/** Extract year value from string */
export const getYearFromDateString = (dateStr: string) => {
    return new Date(dateStr).getFullYear();
};

/** Convert listing title into an seo url friendly string */
export const toSEOFriendlyTitleUrl = (originalName: string, location?: Location): string => {
    const seoName = originalName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");

    const locationStr = getLocationString(location)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");

    return `${seoName}-for-sale${locationStr ? `-in-${locationStr}` : ""}`;
};

/** Convert the location object into a string */
export const getLocationString = (location?: Partial<Location>, countryName?: string) => {
    const itemsArr = [];
    if (location?.city) {
        itemsArr.push(location.city);
    }
    if (location?.state) {
        itemsArr.push(location.state);
    }
    if (countryName) {
        itemsArr.push(countryName);
    } else if (location?.country) {
        itemsArr.push(location?.country);
    }
    return itemsArr.join(", ");
};

/** Get random item from a given generic array */
export function getRandomItem<T>(items: T[]): T | undefined {
    return items[Math.floor(Math.random() * items.length)];
}

/** Calculate the difference between given date and current date. Generate a human friendly string to show the difference in time. */
export const timeAgo = (date: Date): string => {
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - date.getTime();
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const weeksAgo = Math.floor(daysAgo / 7);
    const monthsAgo = Math.floor(currentDate.getMonth() - date.getMonth() + 12 * (currentDate.getFullYear() - date.getFullYear()));
    const yearsAgo = Math.floor(currentDate.getFullYear() - date.getFullYear());

    if (minutesAgo < 1) {
        return "just now";
    } else if (minutesAgo < 60) {
        return minutesAgo === 1 ? "1 minute ago" : `${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
        return hoursAgo === 1 ? "1 hour ago" : `${hoursAgo} hours ago`;
    } else if (daysAgo < 7) {
        return daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
    } else if (weeksAgo < 4) {
        return weeksAgo === 1 ? "1 week ago" : `${weeksAgo} weeks ago`;
    } else if (monthsAgo < 12) {
        return monthsAgo === 1 ? "1 month ago" : `${monthsAgo} months ago`;
    } else {
        return yearsAgo === 1 ? "1 year ago" : `${yearsAgo} years ago`;
    }
};

/** Get a random item within a given range */
export const getRandomNumber = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

/** Check whether profile details exist in-order to decide whether the profile is complete or not */
export const isIncompleteUserProfile = (profile: PartialMessage<UserProfile>) =>
    !profile.data?.phone || !profile.data?.city || !profile.data?.state || !profile.data?.countryCode || !profile.data?.postalCode; // todo: update

/** Get the distance unit for given country. `mi` for US and `km for all other countries` */
export const getDistanceUnit = (countryCode: string | undefined) => (countryCode?.toLowerCase() === "us" ? "mi" : "km");

export const isRenewableListing = (expiryDate: Date): boolean => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 14);

    const isWithinOneWeek = expiryDate <= oneWeekFromNow;
    if (isWithinOneWeek) {
        return true;
    }
    return false;
};

/** Convert year into a yyyy-mm-dd string */
export const convertYearToDateString = (year: string | number): string => {
    const yearNumber = typeof year === "string" ? parseInt(year, 10) : year;

    if (isNaN(yearNumber) || yearNumber < 1000) {
        return "";
    }

    // Assuming January 1st of the given year
    const date = new Date(yearNumber, 0, 1);

    // // Get the year, month, and day from the date object
    const yyyy = date.getFullYear().toString().padStart(4, "0");
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");

    // Format the date as yyyy-mm-dd
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    return formattedDate;
};

/** Convert a camel-case string into a non-camel case string */
export const unCamelCase = (str: string = "") => {
    if (typeof str === "string") {
        return str
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (str) {
                return str.toUpperCase();
            })
            ?.trim();
    }
    return str;
};

/** Add thousands separator commas to a number and return a string */
export const numberWithCommas = (x: number | string) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/** Format distance values with thousands separator and distance unit */
export const getFormattedDistance = (distance: number | string, unit: string = "km") => `${numberWithCommas(distance)} ${unit}`;

/** Format currency values with thousands separator and currency unit */
export const getFormattedCurrency = (amount: number | string = 0, currency: string) => `${currency} ${numberWithCommas(amount)}`;

export const getCacheKeyForFilter = (filters: any) => {
    const cacheKeys: string[] = [];
    if (filters) {
        const keys = Object.keys(filters).sort();
        for (const keyItem of keys) {
            if (filters[keyItem]) {
                cacheKeys.push(`${keyItem}:${filters[keyItem]}`);
            }
        }
    }
    return cacheKeys;
};

/** A promise reterned after given milliseconds */
export const delay = async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
};
