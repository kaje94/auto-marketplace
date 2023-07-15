import { ListingItem, Pagination, Select } from "@/app/_components";
import { Filters } from "./_components";
import { api } from "@/utils/api";

const ListingPage = async () => {
    const listings = await api.getPostedListings();

    return (
        <div className="my-10 grid grid-cols-4 gap-4 xl:gap-7 2xl:gap-8">
            <div className="col-span-4 lg:col-span-1">
                <Filters />
            </div>
            <div className="col-span-4 lg:col-span-3">
                <div className="mb-5 grid items-center gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-3 2xl:gap-8">
                    <div className="col-span-1 text-sm font-light text-info-content 2xl:col-span-2">{listings.totalCount} results found</div>
                    <div className="col-span-1 flex items-center">
                        <label className="mr-5 text-secondary-content">Sort By</label>
                        <Select
                            selectClassName="select-sm "
                            rootClassName="flex-1"
                            options={[
                                { label: "Date: Newest First", value: "date_asc" },
                                { label: "Date: Oldest First", value: "date_dsc" },
                                { label: "Title: A - Z", value: "title_asc" },
                                { label: "Title: Z - A", value: "title_dsc" },
                                { label: "Price: High to Low", value: "price_dsc" },
                                { label: "Price: Low to High", value: "price_asc" },
                            ]}
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-3 2xl:gap-8">
                    {listings?.items?.map((item) => {
                        const thumbnailImage = item.vehicle?.vehicleImages?.find((item) => item.isThumbnail);
                        return (
                            <ListingItem
                                key={item.id}
                                title={item.title}
                                price={new Intl.NumberFormat(undefined, {
                                    style: "currency",
                                    currency: item.price.currency,
                                    minimumFractionDigits: 0,
                                }).format(item.price.amount)}
                                description={item.description}
                                tags={["Colombo", "Used", "23,000 km"]}
                                imageUrl={thumbnailImage?.url ?? ""}
                                imageColor={thumbnailImage?.color ?? ""}
                            />
                        );
                    })}
                    <ListingItem
                        title="Totyota Corrola 2013"
                        price="Rs. 3,400,000"
                        description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
whose shoes does he choose If a dog chews shoes whose shoes does he
choose If a dog chews shoes whose shoes does he choose?"
                        tags={["Colombo", "Used", "23,000 km"]}
                        imageUrl="https://cdn.britannica.com/93/97093-050-23ACD82B/Prius-Toyota-1997.jpg"
                        imageColor="#2596be"
                    />
                </div>
                <Pagination />
            </div>
        </div>
    );
};

export default ListingPage;
