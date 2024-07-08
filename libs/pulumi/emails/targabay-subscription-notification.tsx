import { Column, Img, Link, Section, Text } from "@react-email/components";
import { EmailWrap } from "./components/EmailWrap";
import { baseUrl } from "./utils/configs";

export interface InviteUserEmailProps {
    listings_Items: {
        daysAgo: string;
        imageColor: string;
        imageUrl: string;
        listingUrl: string;
        location: string;
        title: string;
    }[];
    moreListingLink: string;
    subscriptionName: string;
    userName: string;
}

export const Subject = "New Listings Matching Your Subscription Preferences for '{{subscriptionName}}'";

export const TemplateName = "targabay-subscription-template";

export default () => {
    return (
        <EmailWrap
            previewText="Your ideal ride may be just a click away. Explore the latest matches to your listing subscription on Targabay now!"
            footNote={
                <Text className="text-center text-xs opacity-70 mt-2 mb-1 max-w-xl px-2 mx-auto">
                    You're receiving this email because you opted in to receive listing subscription notifications. Manage your preferences or opt out
                    by visiting your <Link href={`${baseUrl}/dashboard/my-subscriptions`}>subscriptions page</Link>.
                </Text>
            }
        >
            <Text>{"Hi {{userName}}"},</Text>
            <Text>
                {
                    "We've found new listings matching your subscription preferences for '{{subscriptionName}}' on Targabay. Don't miss out on the chance to find your ideal ride."
                }
            </Text>
            {"{{#if listings_Items}}"}
            <Section>
                {"{{#each listings_Items}}"}
                <Link href={"{{listingUrl}}"} key="{{title}}">
                    <Section className="rounded-lg p-2 border-[1px] border-gray-200 border-solid mt-1 shadow flex flex-row gap-2">
                        {"{{#if imageUrl}}"}
                        <Column>
                            <Img
                                src="{{imageUrl}}"
                                className="rounded-lg object-cover"
                                style={{ backgroundColor: "{{imageColor}}" }}
                                alt="{{title}}"
                                width="105"
                                height="70"
                            />
                        </Column>
                        {"{{/if}}"}
                        <Column className="align-middle pl-2 text-black flex-1">
                            <Text className="m-0 line-clamp-1 font-medium text-brand text-lg">{"{{title}}"}</Text>
                            <Text className="m-0 line-clamp-1 text-sm">{"{{location}}"}</Text>
                            <Text className="m-0 line-clamp-1 font-light opacity-60 text-xs">Posted {"{{daysAgo}}"}</Text>
                        </Column>
                    </Section>
                </Link>
                {"{{/each}}"}
            </Section>
            {"{{/if}}"}

            {"{{#if moreListingLink}}"}
            <Section className="flex my-8">
                <Link href={"{{moreListingLink}}"} className="px-12 py-3 bg-brand text-white border-brand rounded-lg border-[1px] border-solid">
                    Explore Listings
                </Link>
            </Section>
            {"{{/if}}"}
            <Text>Happy browsing!</Text>
        </EmailWrap>
    );
};
