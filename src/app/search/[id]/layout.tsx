import React from "react";

export default function Layout(props: { details: React.ReactNode; relatedListings: React.ReactNode }) {
    return (
        <div className="container mx-auto p-4 !pt-0 xl:p-7 2xl:p-8">
            <div className="my-9">
                {props.details}
                {props.relatedListings}
            </div>
        </div>
    );
}
