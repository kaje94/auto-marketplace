import React from "react";

export default function Layout(props: {
    heroSection: React.ReactNode;
    featuresSection: React.ReactNode;
    contactUsSection: React.ReactNode;
    featuredListings: React.ReactNode;
}) {
    return (
        <>
            {props.heroSection}
            {props.featuredListings}
            {props.featuresSection}
            {props.contactUsSection}
        </>
    );
}
