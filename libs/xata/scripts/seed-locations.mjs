// @ts-check
import { buildClient } from "@xata.io/client";
import * as csv from "csv-parse/sync";
import fs from "fs";

const countryFileData = fs.readFileSync("scripts/csvs/countries.csv", "utf8");
const stateFileData = fs.readFileSync("scripts/csvs/states.csv", "utf8");
const citiesFileData = fs.readFileSync("scripts/csvs/cities.csv", "utf8");

/** @type {{ iso2: string; }[]} */
const countries = csv.parse(countryFileData, {
    columns: true,
    skip_empty_lines: true,
});

/** @type {{ country_code: string; id: number; name: string; }[]} */
const states = csv.parse(stateFileData, {
    columns: true,
    skip_empty_lines: true,
});

/** @type {{ country_code: string; state_id: number; name: string }[]} */
const cities = csv.parse(citiesFileData, {
    columns: true,
    skip_empty_lines: true,
});

class XataClient extends buildClient() {
    /** @param {{}} options */
    constructor(options) {
        super({ ...options });
    }
}

const xata = new XataClient({
    databaseURL: process.env.XATA_DATABASE_URL,
    apiKey: process.env.XATA_API_KEY,
    branch: process.argv[2] || process.env.XATA_BRANCH,
});

function generateLocationData() {
    /** @type {{ countryCode: string; id: string; stateName: string; cities: string[] }[]} */
    const stateList = [];
    let countryCount = 0;

    for (const country of countries) {
        const { iso2 } = country;

        const statesOfCountry = states.filter((state) => state.country_code.toLowerCase() == iso2.toLowerCase());
        for (const state of statesOfCountry) {
            const stateCities = cities
                .filter((city) => city.country_code.toLowerCase() == iso2.toLowerCase() && state.id == city.state_id)
                .map((city) => city.name);

            stateList.push({
                id: state.id.toString(),
                stateName: state.name,
                countryCode: state.country_code.toLowerCase(),
                cities: stateCities,
            });
        }
        countryCount++;
        console.log(`Reading location details for country ${countryCount} out of ${countries.length}`);
    }
    console.log(`Read ${stateList.length} rows(state details) to be inserted`);
    return stateList;
}

async function isDBpopulated() {
    const { aggs } = await xata.db.locations.aggregate({
        totalCount: { count: "*" },
    });

    if (aggs.totalCount > 0) {
        return true;
    }

    return false;
}

export async function seed() {
    if (await isDBpopulated()) {
        console.warn("Database is not empty. Skip seeding...");
        return;
    }

    const data = generateLocationData();

    try {
        await xata.db.locations.create(data);
        console.log(`🎉 ${data.length} records successfully inserted!`);
        return "success";
    } catch (err) {
        console.error("Gone wrong: ", err);
    }
}

try {
    console.log(`❯ Pushing location data to: ${process.env.XATA_DATABASE_URL}`);
    seed();
} catch {
    console.warn("Seeding gone wrong.");
}
