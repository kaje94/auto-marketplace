import { Link, Section, Text } from "@react-email/components";
import { EmailWrap } from "./components/EmailWrap";

export interface ListingStatusEmailProps {
    listingTitle: string;
    listingUrl: string;
    userName: string;
}

export const Subject = "Listing advert for {{listingTitle}} has been approved";

export const TemplateName = "targabay-listing-approved-template";

export default () => {
    return (
        <EmailWrap previewText="Your listing for {{listingTitle}} has been approved">
            <Text>{"Hi {{userName}}"},</Text>
            <Text>
                {
                    "Your listing for {{listingTitle}} is now live on Targabay. Users can explore and discover your vehicle. Best of luck with your sale! For assistance, contact our support team."
                }
            </Text>
            <Section className="flex my-8">
                <Link href={"{{listingUrl}}"} className="px-12 py-3 bg-brand text-white rounded-lg border-[1px] border-solid">
                    View Created Listing
                </Link>
            </Section>
        </EmailWrap>
    );
};
