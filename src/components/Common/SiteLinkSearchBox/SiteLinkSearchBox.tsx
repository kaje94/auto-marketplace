import Head from "next/head";
import { FC } from "react";
import { env } from "@/env.mjs";

const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: `${env.AUTH0_BASE_URL}/`,
    potentialAction: [
        {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${env.AUTH0_BASE_URL}/search?Title={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    ],
};

export const SiteLinkSearchBox: FC = () => {
    return (
        <Head>
            <script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} type="application/ld+json" />
        </Head>
    );
};
