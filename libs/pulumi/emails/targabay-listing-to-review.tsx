import { Link, Section, Text } from "@react-email/components";
import { EmailWrap } from "./components/EmailWrap";

export interface ListingStatusEmailProps {
    count: string;
    listingUrl: string;
}

export const Subject = "{{ count }} new listings needs to be reviewed";

export const TemplateName = "targabay-listing-to-review";

export default () => {
    return (
        <EmailWrap previewText="{{ count }} new listings needs to be reviewed">
            <Text>{"Hi admin"},</Text>
            <Text>{"There are {{ count }} new listings that needs to be reviewed in order to be either posted in Targabay or rejected."}</Text>
            <Section className="flex my-8">
                <Link href={"{{listingUrl}}"} className="px-12 py-3 bg-brand text-white rounded-lg border-[1px] border-solid">
                    Review Listings
                </Link>
            </Section>
        </EmailWrap>
    );
};
