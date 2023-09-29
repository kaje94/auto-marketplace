import React from "react";

export default function Layout(props: {
    contactUsSection: React.ReactNode;
    featuredListings: React.ReactNode;
    featuresSection: React.ReactNode;
    heroSection: React.ReactNode;
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
