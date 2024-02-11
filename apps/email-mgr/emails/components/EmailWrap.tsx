import { Body, Container, Head, Html, Img, Link, Preview, Tailwind, Text } from "@react-email/components";
import { tailwindConfig, baseUrl } from "../utils/configs";
import * as React from "react";

export const EmailWrap = ({ children, previewText }: React.PropsWithChildren & { previewText: string }) => {
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind config={tailwindConfig}>
                <Body className="bg-offwhite text-base font-sans p-4">
                    <Container className="bg-white p-45 shadow rounded text-black">
                        <Link href={baseUrl}>
                            <Img src={`${baseUrl}/images/logo-transparent-bg-500x150.png`} width="250" alt="Targabay" className="mx-auto mb-12" />
                        </Link>
                        {children}
                    </Container>
                </Body>
                <Text className="text-center text-xs opacity-30">© 2023 Targabay. All Rights Reserved.</Text>
            </Tailwind>
        </Html>
    );
};
