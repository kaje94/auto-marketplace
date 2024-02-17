import { Link, Text, Section } from "@react-email/components";
import { baseUrl } from "./utils/configs";
import { EmailWrap } from "./components/EmailWrap";

export interface ListingStatusEmailProps {
    userName: string;
    listingTitle: string;
    listingUrl: string;
    rejectionCause: string;
}

export const Subject = "Listing advert for {{listingTitle}} has been rejected";

export const TemplateName = "targabay-listing-rejected-template";

export default () => {
    return (
        <EmailWrap previewText="The status of your listing advert {{listingTitle}} has been updated as {{statusText}}">
            <Text>{"Hi {{userName}}"},</Text>
            <Text>
                {
                    "We regret to inform you that your listing for {{listingTitle}} did not meet our quality standards and has been rejected due to the following reason."
                }
            </Text>
            <Text className="text-error">{"Reason: {{rejectionCause}}"}</Text>
            <Section className="flex my-8">
                <Link href={"{{listingUrl}}"} className="px-12 py-3  rounded-lg border-[1px] border-solid">
                    View Rejected Listing
                </Link>
            </Section>
            <Text>
                Please review our guidelines carefully and consider submitting a revised listing. If you have any questions or need assistance in
                understanding the rejection reason, don't hesitate to contact our support team. Thank you for your understanding.
            </Text>
        </EmailWrap>
    );
};
