import { Carousel } from "./_components";
import { InfoIcon, ShareIcon, TwitterIcon, FacebookIcon, CopyIcon } from "@/icons";
import { ListingItem } from "@/app/_components";

const ItemDetailPage = () => {
    const FEATUES = ["AIR BAGS", "POWER STEARING", "POWER WINDOW", "AIR CONDITION", "POWER MIRROR"];
    const description = `Personally Imported in 2018/11 - 1st Owner
  Year of manufacture 2015
  Year registration 2018/11
  Original Push Star
  CBE-××××
  Magnetic Grey Metallic Color
  Two-tone Interior 
  Dual Airbag
  Power Shutter
  Winker Mrror
  Head Light Adjuster, Traction Control, Auto Stop
  Alloy Wheel
  Air Pressure Monitor + Sensors
  Japan Original Sound Setup + Original Vitz 4 Speakers ( Front 2 , Rear 2 ) 
  Mileage 106,00 ( 64,500 in Sri Lanka + 41,500 in Japan ) 
  Toyota Lanka Maintained - Service records available
  Rear Camera, Dash Camera ( Fitted )`;

    return (
        <>
            <div className="mb-8 mt-14">
                <div className={"text-center text-3xl font-extrabold text-primary-content lg:text-6xl"}>Toyota Supra 2009</div>
                <div className="text-secondary-content-content lg:text-md mt-2 text-center text-sm font-light">
                    Posted 2 days ago, Location: Colombo, Sri Lanka
                </div>
            </div>

            {/** TODO: use breadcrumb component instead */}
            <div className="breadcrumbs mb-1 text-sm">
                <ul>
                    <li>
                        <a>Search</a>
                    </li>
                    <li>
                        <a>Cars</a>
                    </li>
                    <li>
                        <a>Cars in Colombo</a>
                    </li>
                    <li>Toyota Supra 2009</li>
                </ul>
            </div>

            <div className="grid grid-cols-8 gap-4 xl:gap-7 2xl:gap-8">
                <div className="col-span-8 flex flex-col gap-4 lg:col-span-5 xl:gap-7 2xl:gap-8">
                    <div className="card  bg-base-100 shadow">
                        <Carousel />
                    </div>
                    <div className="stat card  bg-base-100 p-3  shadow lg:p-5 xl:p-6">
                        <div className="stat-title">Description</div>
                        <div className="divider" />
                        <p className="mt-2 w-full whitespace-pre-line text-sm font-medium">{description}</p>
                    </div>
                </div>
                <div className="col-span-8 flex flex-col gap-4 lg:col-span-3 xl:gap-7 2xl:gap-8">
                    <div className="stat card place-items-center bg-base-100 shadow">
                        <div className="stat-title">Price</div>
                        <div className="mt-2 text-center text-3xl font-extrabold">LKR 255,400,000</div>
                        <span className="badge mt-2">Negotiable</span>
                    </div>
                    <div className="stat card place-items-center bg-base-100 shadow">
                        <div className="stat-title">Key Specifications</div>

                        <div className="mt-2 grid w-full gap-2 lg:grid-cols-2">
                            <div className="flex flex-col items-center gap-1 lg:items-start">
                                <div className="font-light">
                                    Brand:<span className="ml-1 font-semibold text-primary-content">Toyota</span>
                                </div>
                                <div className="font-light">
                                    Modal:<span className="ml-1 font-semibold text-primary-content">Corola</span>
                                </div>
                                <div className="font-light">
                                    Trim / Edition::<span className="ml-1 font-semibold text-primary-content">FZ</span>
                                </div>
                                <div className="font-light">
                                    Condition::<span className="ml-1 font-semibold text-primary-content">Used</span>
                                </div>
                                <div className="font-light">
                                    Year of Manufacture:<span className="ml-1 font-semibold text-primary-content">2009</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1 text-right lg:items-end">
                                <div className="font-light">
                                    Milage:<span className="ml-1 font-semibold text-primary-content">200,00 Miles</span>
                                </div>
                                <div className="font-light">
                                    Transimsion:<span className="ml-1 font-semibold text-primary-content">Manual</span>
                                </div>
                                <div className="font-light">
                                    Fuel Type:<span className="ml-1 font-semibold text-primary-content">Petrol</span>
                                </div>
                                <div className="font-light">
                                    Engine Capacity:<span className="ml-1 font-semibold text-primary-content">1,000 cc</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stat card place-items-center bg-base-100 shadow">
                        <div className="stat-title">Features</div>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                            {FEATUES.map((item) => (
                                <span key={item} className="badge-outline badge">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="stat card place-items-center bg-base-100 shadow">
                        <div className="stat-title">Seller</div>
                        <div className="avatar my-4">
                            <div className="w-20 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                                <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg" />
                            </div>
                        </div>
                        <div className="text-center text-2xl font-extrabold">Kajendran Alagaratnam</div>
                        <div className="mt-2 flex flex-col items-center gap-1">
                            <div className="font-light">
                                Contact Number:<span className="ml-1 font-semibold text-primary-content">0771234123</span>
                            </div>
                            <div className="font-light">
                                Email:<span className="ml-1 font-semibold text-primary-content">bob@gmail.com</span>
                            </div>
                            <div className="font-light">
                                Location:<span className="ml-1 font-semibold text-primary-content">Colombo, Sri Lanka</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="dropdown-top dropdown-end dropdown">
                            <button tabIndex={0} className="btn-block btn gap-2">
                                <ShareIcon />
                                Share
                            </button>
                            <ul tabIndex={0} className="dropdown-content menu rounded-box  mb-2 w-11/12 bg-base-100 p-2 shadow-2xl">
                                <li className="flex cursor-pointer rounded-lg duration-200 hover:bg-base-200">
                                    <button>
                                        <CopyIcon /> Copy Link
                                    </button>
                                </li>
                                <li>
                                    <a>
                                        <FacebookIcon /> Share in Facebook
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <TwitterIcon /> Share in Twitter
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <button tabIndex={0} className="btn-error btn-ghost btn-block btn gap-2">
                            <InfoIcon />
                            Report
                        </button>
                    </div>
                </div>
            </div>
            <div className="divider mt-16">Related Vehicles</div>
            <div className="my-10 grid gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-4 2xl:gap-8">
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
        </>
    );
};

export default ItemDetailPage;
