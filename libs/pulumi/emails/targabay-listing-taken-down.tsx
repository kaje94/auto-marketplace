import { Text } from "@react-email/components";
import { EmailWrap } from "./components/EmailWrap";

export interface ListingStatusEmailProps {
    listingTitle: string;
    listingUrl: string;
    userName: string;
}

export const Subject = "Listing advert for {{listingTitle}} has been taken down";

export const TemplateName = "targabay-listing-taken-down-template";

export default () => {
    return (
        <EmailWrap previewText="Your listing for {{listingTitle}} has been taken down">
            <Text>{"Hi {{userName}}"},</Text>
            <Text>
                Regrettably, your listing has been taken down due to a violation of our policies. To prevent future issues, we strongly recommend
                reviewing our guidelines thoroughly. Understanding and adhering to our policies ensures a smooth experience on Targabay. If you have
                any questions or need clarification on the specific violation, please don't hesitate to reach out to our support team. Thank you for
                your cooperation.
            </Text>
        </EmailWrap>
    );
};
