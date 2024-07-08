import { Link, Text } from "@react-email/components";
import { EmailWrap } from "./components/EmailWrap";
import { baseUrl } from "./utils/configs";

export interface WelcomeEmailProps {
    countryCode: string;
    userName: string;
}

export const Subject = "Welcome to Targabay";

export const TemplateName = "targabay-welcome-template";

export default () => {
    return (
        <EmailWrap previewText="Start your vehicle journey with Targabay: Explore listings, buy with ease, and sell effortlessly!">
            <Text>{"Hi {{userName}}"},</Text>
            <Text>
                Welcome to Targabay! Whether you're looking to buy or sell, Targabay is your one-stop destination for all things vehicles! Dive into
                our world of verified listings and enjoy a seamless experience tailored just for you.
            </Text>
            <ul>
                {points.map((item) => (
                    <li>
                        <Text>
                            <Link className="text-brand underline font-medium" href={`${baseUrl}/{{countryCode}}${item.path}`}>
                                {item.prefix}
                            </Link>{" "}
                            {item.text}
                        </Text>
                    </li>
                ))}
            </ul>
            <Text>Ready to embark on your vehicle journey with Targabay? Start exploring, subscribing, and selling today!</Text>
        </EmailWrap>
    );
};

const points = [
    {
        prefix: "Explore",
        text: "our verified vehicle listing adverts for buying or selling.",
        path: "/search",
    },
    {
        prefix: "Create an advert",
        text: "and watch your vehicle sell quickly if you're a seller.",
        path: "/dashboard/new-listing",
    },
    {
        prefix: "Subscribe",
        text: "to notifications for listings matching your preferences if you're a buyer.",
        path: "/dashboard/new-subscription",
    },
];
