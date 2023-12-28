export const numberWithCommas = (x: number | string) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getFormattedCurrency = (amount: number | string = 0, currency: string) => `${currency} ${numberWithCommas(amount)}`;

export const getFormattedDistance = (distance: number | string, unit: string = "km") => `${numberWithCommas(distance)} ${unit}`;

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
