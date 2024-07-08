import { Body, Container, Font, Head, Html, Img, Link, Preview, Tailwind, Text } from "@react-email/components";
import * as React from "react";
import { baseUrl, tailwindConfig } from "../utils/configs";

export const EmailWrap = ({ children, previewText, footNote }: React.PropsWithChildren & { footNote?: React.ReactNode; previewText: string }) => {
    return (
        <Html>
            <Tailwind config={tailwindConfig}>
                <Head>
                    <Font
                        fontFamily="Montserrat"
                        fallbackFontFamily="Verdana"
                        webFont={{
                            url: "https://fonts.cdnfonts.com/s/14883/Montserrat-Regular.woff",
                            format: "woff2",
                        }}
                    />
                </Head>
                <Preview>{previewText}</Preview>
                <Body className="bg-offwhite text-base font-sans p-2">
                    <Container className="bg-white p-8 shadow rounded-lg text-black">
                        <Link href={baseUrl}>
                            <Img
                                src={`${baseUrl}/images/logo-transparent-bg-500x150.png`}
                                width="250"
                                alt="Targabay"
                                className="mx-auto mb-6 !bg-white"
                            />
                        </Link>
                        {children}
                        <Text>
                            Best Regards,
                            <br />
                            The Targabay team
                        </Text>
                    </Container>
                    {footNote}
                    <Text className="text-center font-light text-xs opacity-70 max-w-xl my-1 px-2 mx-auto">
                        Please do not reply to this automated email. For assistance, visit our <Link href={`${baseUrl}/contact-us`}>Contact us</Link>{" "}
                        page.
                    </Text>
                    <Text className="text-center  font-light text-xs opacity-50 my-1 mb-2 px-2 mx-auto">© 2023 Targabay. All Rights Reserved.</Text>
                </Body>
            </Tailwind>
        </Html>
    );
};
