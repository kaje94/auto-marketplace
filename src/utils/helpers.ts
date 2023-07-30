import { FastAverageColor } from "fast-average-color";
import { Vehicle, Location } from "./types";

export const convertYearToDateString = (year: string | number): string => {
    const yearNumber = typeof year === "string" ? parseInt(year, 10) : year;

    if (isNaN(yearNumber) || yearNumber < 1000) {
        return "";
    }

    // Assuming January 1st of the given year
    const date = new Date(yearNumber, 0, 1);

    // Get the year, month, and day from the date object
    const yyyy = date.getFullYear().toString().padStart(4, "0");
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");

    // Format the date as yyyy-mm-dd
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    return formattedDate;
};

export const uploadToS3 = async (file: File, url: string, key: string, bucket: string, region: string, previewUrl: string) => {
    const fac = new FastAverageColor();
    const color = await fac.getColorAsync(previewUrl);

    const buffer = await file.arrayBuffer();

    await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("Cache-Control", "max-age=630720000");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject();
                }
            }
        };

        xhr.send(buffer);
    });

    const resultUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return { url: resultUrl, color: color.hex };
};

export const getFormattedCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount);

export const getListingTags = (location: Location, vehicle: Vehicle) => {
    return [location.city, unCamelCase(vehicle.condition), `${vehicle.millage} km`];
};

export const unCamelCase = (str: string) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
        return str.toUpperCase();
    });
