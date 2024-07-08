import { Link, Section, Text } from "@react-email/components";
import { EmailWrap } from "./components/EmailWrap";

export interface ListingStatusEmailProps {
    listingTitle: string;
    listingUrl: string;
    userName: string;
}

export const Subject = "Listing advert for {{listingTitle}} has been expired";

export const TemplateName = "targabay-listing-expired-template";

export default () => {
    return (
        <EmailWrap previewText="Renew your listing by visiting Targabay">
            <Text>{"Hi {{userName}}"},</Text>
            <Text>
                {
                    "Your listing for {{listingTitle}} has expired, but you have the chance to keep it active! Simply visit your listing page on Targabay and proceed with the renewal. This ensures that your vehicle stays visible and increases the likelihood of finding the right buyer. "
                }
            </Text>
            <Section className="flex my-8">
                <Link href={"{{listingUrl}}"} className="px-12 py-3 bg-brand text-white rounded-lg border-[1px] border-solid">
                    View Listing
                </Link>
            </Section>
            <Text>
                Should you have any questions or need assistance with the renewal process, don't hesitate to reach out to our support team. Thank you
                for choosing Targabay!
            </Text>
        </EmailWrap>
    );
};
