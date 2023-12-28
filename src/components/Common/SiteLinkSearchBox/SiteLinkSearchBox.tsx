import Script from "next/script";
import { FC } from "react";
import { env } from "@/env.mjs";

const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: env.AUTH0_BASE_URL,
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
    description:
        "Effortlessly find your perfect vehicle on Targabay's marketplace. Explore diverse cars, bikes, and more with our intuitive search. Targabay simplifies the search for a seamless and personalized experience.",
};

/** Site search link to be used by search engines */
export const SiteLinkSearchBox: FC = () => {
    return <Script dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} id="site-link-search" type="application/ld+json" />;
};
