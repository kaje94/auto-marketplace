import { Input, Select, BreadCrumbs, TextArea, Checkbox, TagSelect } from "@/app/_components";

// vehicle details
// vehicleImages
// featureIds

// other details

const TAGS = [
    {
        id: 8,
        name: "4-WAY CAMERA",
    },
    {
        id: 4,
        name: "ADAPTIVE CRUISE CONTROL",
    },
    {
        id: 14,
        name: "AIR CONDITIONING",
    },
    {
        id: 6,
        name: "BREAK ASSIST",
    },
    {
        id: 13,
        name: "DUAL AIR CONDITIONING",
    },
    {
        id: 11,
        name: "ELECTRIC SEATS",
    },
    {
        id: 18,
        name: "HEATED SEATS",
    },
    {
        id: 16,
        name: "LANE ASSIST",
    },
    {
        id: 15,
        name: "MEMORY SEATS",
    },
    {
        id: 17,
        name: "PARK ASSIST",
    },
    {
        id: 19,
        name: "POWER MIRROR",
    },
    {
        id: 2,
        name: "POWER STEERING",
    },
    {
        id: 3,
        name: "POWER STEERING",
    },
    {
        id: 20,
        name: "POWER WINDOW",
    },
    {
        id: 10,
        name: "PUSH START",
    },
    {
        id: 7,
        name: "REVERSE CAMERA",
    },
    {
        id: 1,
        name: "SRS AIR BAGS",
    },
    {
        id: 12,
        name: "SUNROOF",
    },
    {
        id: 5,
        name: "TRACTION CONTROL",
    },
    {
        id: 9,
        name: "WINKER MIRRORS",
    },
];

const MyAds = () => {
    return (
        <>
            <BreadCrumbs
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { href: "/dashboard/my-ads", title: "My Adverts" }]}
                currentPageTitle="Add new"
            />
            <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Key Specifications</div>
                        <Select
                            label="Type"
                            options={[
                                { label: "Car", value: "Car" },
                                { label: "SUV", value: "SUV" },
                                { label: "Van", value: "Van" },
                            ]}
                            placeholder="Select Type"
                        />
                        <div className="grid gap-1 sm:grid-cols-2">
                            <Input placeholder="Toyota, Nissan, Honda, etc" label="Brand" />
                            <Input placeholder="Civic, Sunny, Swift, etc" label="Model" />
                            <Input placeholder="LX, EX, EX-L, Sport, etc" label="Trim" />
                            <Input placeholder="2008" label="Year of Manufacture" type="number" />
                            <Input placeholder="2020" label="Year of Registration" type="number" />
                            <Input placeholder="50000" label="Milage" type="number" />
                            <Select
                                label="Condition"
                                options={[
                                    { label: "New", value: "New" },
                                    { label: "Used", value: "Used" },
                                    { label: "Refurbished", value: "Refurbished" },
                                ]}
                                placeholder="Select Condition"
                            />
                            <Select
                                label="Transmission Type"
                                options={[
                                    { label: "Automatic", value: "Automatic" },
                                    { label: "Manual", value: "Manual" },
                                    { label: "Tiptronic", value: "Tiptronic" },
                                    { label: "Other", value: "Other" },
                                ]}
                                placeholder="Select Type"
                            />
                            <Select
                                label="Fuel Type"
                                options={[
                                    { label: "Petrol", value: "Petrol" },
                                    { label: "Diesel", value: "Diesel" },
                                    { label: "Hybrid", value: "Hybrid" },
                                    { label: "Electric", value: "Electric" },
                                    { label: "Other", value: "Other" },
                                ]}
                                placeholder="Select Fuel Type"
                            />
                            <Input placeholder="1200" label="Engine Capacity" type="number" />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Other details</div>
                        <TextArea label="Description" placeholder="Description of the vehicle for sale" />
                        <Checkbox label="Has Ongoing Lease" inputClassNames="mt-2" />
                    </div>
                </div>
                <div className="flex flex-col gap-4 xl:gap-7 2xl:gap-8">
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Images</div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Location Details</div>
                        <div className="grid gap-1 sm:grid-cols-2">
                            <Input placeholder="Street Name" label="Street" />
                            <Input placeholder="Colombo" label="City" />
                            <Input placeholder="Colombo" label="District" />
                            <Input placeholder="00001" label="Postal Code" />
                        </div>
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Price Details</div>
                        <Input placeholder="40000000" label="Price" type="number" />
                        <Checkbox label="Negotiable Price" inputClassNames="mt-2" />
                    </div>
                    <div className="stat card bg-base-100 p-4 shadow">
                        <div className="stat-title">Features</div>
                        <span className="mt-2">
                            <TagSelect tags={TAGS} selectedTags={[2, 3]} />
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex justify-end">
                <button className="btn-neutral btn-wide btn">Create</button>
            </div>
        </>
    );
};

export default MyAds;
