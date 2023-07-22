import { BreadCrumbs } from "@/app/_components";
import { MyAdItem } from "./_components";

const MyAds = () => {
    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="My Adverts" />
            <div className="grid gap-1 xl:gap-2">
                <MyAdItem
                    title="Totyota Corrola 2013"
                    price="Rs. 3,400,000"
                    description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
whose shoes does he choose If a dog chews shoes whose shoes does he
choose If a dog chews shoes whose shoes does he choose?"
                    tags={["Colombo", "Used", "23,000 km"]}
                />
                <MyAdItem
                    title="Totyota Corrola 2013dasda sdkas dak jsdk jsa"
                    price="Rs. 3,400,000"
                    description="If a dog chews shoes whose "
                    tags={["Galle", "Used", "123,000 km"]}
                    state="under-review"
                />
                <MyAdItem
                    title="Toyota Townace CR27 1993"
                    price="Rs. 3,400,000"
                    description="If a dog chews shoes whose shoes does he choose If a dog chews shoes
whose shoes does he choose If a dog chews shoes whose shoes does he
choose If a dog chews shoes whose shoes does he choose?"
                    tags={["Nuwara Eliya", "Used", "223,000 km"]}
                    state="expired"
                />
            </div>
        </>
    );
};

export default MyAds;
