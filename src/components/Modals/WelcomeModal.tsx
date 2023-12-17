"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { LinkWithLocale, ModalFooter } from "@/components/Common";

const Modal = dynamic(() => import("@/components/Common").then((mod) => mod.Modal), { ssr: false });

export const WelcomeModal = () => {
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const userConsent = window.localStorage.getItem("user-consent-v1");
        if (!userConsent) {
            setModalVisible(true);
        }
    }, []);

    return (
        <>
            <Modal cancelable={false} onVisibleChange={() => {}} title="Welcome to Targabay" visible={modalVisible}>
                <form className="grid gap-1">
                    <div>
                        We&#39;re dedicated to making your vehicle buying and selling experience smooth and enjoyable. Here&#39;s what you can do:
                        <ul className="mt-2 list-disc pl-5 text-sm">
                            <li>
                                <b>Find Your Perfect Ride: </b>Discover a diverse range of verified vehicle listings.
                            </li>
                            <li>
                                <b>Connect with Sellers: </b>Find vehicle sellers with ease and get in touch with them
                            </li>
                            <li>
                                <b>Stay Informed: </b>Subscriptions ensure you receive notifications about new listings that align with your
                                interests..
                            </li>
                            <li>
                                <b>Sell for Free:</b> List your vehicle without any fees.
                            </li>
                        </ul>
                    </div>

                    <div className="mt-6 text-sm">
                        By clicking &#39;Agree & Continue,&#39; you acknowledge that you&#39;ve read, understood, and accepted our&nbsp;
                        <LinkWithLocale className="link" href="/privacy-policy" onClick={() => setModalVisible(false)}>
                            Privacy Policy
                        </LinkWithLocale>
                        , and&nbsp;
                        <LinkWithLocale className="link" href="/cookie-policy" onClick={() => setModalVisible(false)}>
                            Cookie Policy
                        </LinkWithLocale>
                        .
                    </div>
                    <ModalFooter
                        onSubmit={() => {
                            window?.localStorage?.setItem("user-consent-v1", "true");
                            setModalVisible(false);
                        }}
                        onVisibleChange={() => {}}
                        primaryButton={{ text: "Agree & Continue", classNames: "btn-block btn-neutral" }}
                        showCancel={false}
                    />
                </form>
            </Modal>
        </>
    );
};
