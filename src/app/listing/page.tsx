import { NextPage } from "next";
import { Footer } from "./components/Footer";
import { ListingItem } from "./components/ListingItem";
import { NavBar } from "./components/NavBar";
import { Pagination } from "./components/Pagination";
import { Filters } from "./components/Filters";
import { Select } from "./components/Select";

const ListingPage: NextPage = () => {
  return (
    <>
      <div className="container mx-auto p-4 xl:p-7 2xl:p-8 min-h-screen ">
        <div className="relative">
          <NavBar />
        </div>
        <div className="grid grid-cols-4 gap-4 xl:gap-7 2xl:gap-8 my-10">
          <div className="lg:col-span-1 col-span-4">
            <Filters />
          </div>
          <div className="lg:col-span-3 col-span-4">
            <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-4 xl:gap-7 2xl:gap-8 mb-5 items-center">
              <div className="font-light col-span-1 2xl:col-span-2 text-sm text-info-content">
                25 results found
              </div>
              <div className="flex items-center col-span-1">
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

            <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-4 xl:gap-7 2xl:gap-8">
              <ListingItem
                title="Totyota Corrola 2013"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
      whose shoes does he choose If a dog chews shoes whose shoes does he
      choose If a dog chews shoes whose shoes does he choose?"
                tags={["Colombo", "Used", "23,000 km"]}
              />
              <ListingItem
                title="Totyota Corrola 2013dasda sdkas dak jsdk jsa"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose "
                tags={["Galle", "Used", "123,000 km"]}
              />
              <ListingItem
                title="Toyota Townace CR27 1993"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Nuwara Eliya", "Used", "223,000 km"]}
              />
              <ListingItem
                title="Suzuki Wagon R 2021"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Kandy", "Brand New", "0 km"]}
              />
              <ListingItem
                title="Toyota Townace CR27 1993"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Nuwara Eliya", "Used", "223,000 km"]}
              />
              <ListingItem
                title="Suzuki Wagon R 2021"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Kandy", "Brand New", "0 km"]}
              />
              <ListingItem
                title="Toyota Townace CR27 1993"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Nuwara Eliya", "Used", "223,000 km"]}
              />
              <ListingItem
                title="Suzuki Wagon R 2021"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Kandy", "Brand New", "0 km"]}
              />
              <ListingItem
                title="Toyota Townace CR27 1993"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Nuwara Eliya", "Used", "223,000 km"]}
              />
              <ListingItem
                title="Suzuki Wagon R 2021"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Kandy", "Brand New", "0 km"]}
              />
              <ListingItem
                title="Toyota Townace CR27 1993"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Nuwara Eliya", "Used", "223,000 km"]}
              />
              <ListingItem
                title="Suzuki Wagon R 2021"
                price="Rs. 3,400,000"
                description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
          whose shoes does he choose If a dog chews shoes whose shoes does he
          choose If a dog chews shoes whose shoes does he choose?"
                tags={["Kandy", "Brand New", "0 km"]}
              />
            </div>
            <Pagination />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingPage;
