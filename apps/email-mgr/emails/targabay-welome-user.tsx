import { Body, Button, Column, Container, Head, Heading, Hr, Html, Img, Link, Preview, Row, Section, Tailwind, Text } from "@react-email/components";
import { baseUrl } from "./utils/configs";
import { EmailWrap } from "./components/EmailWrap";
import * as React from "react";

interface VercelInviteUserEmailProps {
    username?: string;
}

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

// Subject: Discover Targabay - Your Hub for Buying and Selling Vehicles!
export const TargabayInviteUserEmail = ({ username = "User name" }: VercelInviteUserEmailProps) => {
    return (
        <EmailWrap previewText="Welcome to Targabay, Your Easy Way to Explore and Sell Vehicles!">
            <Text>Hi {username},</Text>
            <Text>
                Welcome to Targabay! Whether you're looking to buy or sell, Targabay is your one-stop destination for all things vehicles! Dive into
                our world of verified listings and enjoy a seamless experience tailored just for you.
            </Text>
            <ul>
                {points.map((item) => (
                    <li>
                        <Text>
                            <Link className="text-brand underline font-medium" href={`${baseUrl}/CTRY${item.path}`}>
                                {item.prefix}
                            </Link>{" "}
                            {item.text}
                        </Text>
                    </li>
                ))}
            </ul>
            <Text>Ready to embark on your vehicle journey with Targabay? Start exploring, subscribing, and selling today!</Text>
            <Text>
                Best Regards,
                <br />
                The Targabay team
            </Text>
        </EmailWrap>
    );
};

export default TargabayInviteUserEmail;
