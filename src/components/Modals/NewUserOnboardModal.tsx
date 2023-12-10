"use client";
import { Claims } from "@auth0/nextjs-auth0/edge";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { useParams, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale, Modal } from "@/components/Common";
import { CheckCircleIcon } from "@/icons";
import { useScopedI18n } from "@/locales/client";
import { ListingUser } from "@/utils/types";

interface Props {
    userClaims?: Claims;
    userData?: ListingUser;
}

const ProfileUpdateModal = dynamic(() => import("./ProfileUpdateModal").then((mod) => mod.ProfileUpdateModal), { ssr: false });

const SectionWrap = ({ children, isOpen, onClick }: { children: ReactNode; isOpen: boolean; onClick: () => void }) => (
    <div className={clsx("collapse join-item border border-base-300", isOpen && "collapse-open")} onClick={onClick}>
        {children}
    </div>
);

const SectionTitle = ({ showSuccess, title, disabled = false }: { disabled?: boolean; showSuccess?: boolean; title: string }) => {
    return (
        <div className={clsx("collapse-title flex w-full items-center justify-between p-4 text-sm", disabled && "!cursor-not-allowed opacity-50")}>
            {title}
            {showSuccess && <CheckCircleIcon className="text-success" />}
        </div>
    );
};

const RedirectLinks = ({ btnTitle, desc, href, closeModal }: { btnTitle: string; closeModal: () => void; desc: string; href: string }) => {
    return (
        <>
            <p className="mb-1 text-center text-sm">{desc}</p>
            <LinkWithLocale href={href}>
                <button className="btn btn-neutral btn-wide" onClick={closeModal}>
                    {btnTitle}
                </button>
            </LinkWithLocale>
        </>
    );
};

export const NewUserOnboardModal = (props: Props) => {
    const { userClaims, userData } = props;
    const pathname = usePathname();
    const params = useParams();
    const [modalVisible, setModalVisible] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [profileStepComplete, setProfileStepComplete] = useState(false);
    const [interests, setInterests] = useState<"buyer" | "seller" | "">("");

    const tCommon = useScopedI18n("common");
    const tNav = useScopedI18n("nav");
    const tNewUserOnboardModal = useScopedI18n("components.modals.newUserOnboardModal");

    useEffect(() => {
        if (userClaims?.new_user) {
            const onboardShown = window.localStorage.getItem(`user-onboard-shown-${userClaims.sub}-v1`);
            if (!onboardShown) {
                setModalVisible(true);
                window?.localStorage?.setItem(`user-onboard-shown-${userClaims.sub}-v1`, "true");
            }
        }
    }, [userClaims]);

    const isUserInHomePage = pathname === `/${params.locale}`;

    return (
        <>
            <Modal modalClassnames="!max-w-4xl" visible={!!modalVisible} onVisibleChange={setModalVisible}>
                <div className="flex flex-col gap-1">
                    <div className={clsx("text-3xl xl:text-4xl", displayFont.className)}>
                        {tNewUserOnboardModal("title", { firstName: userData?.firstName })}
                    </div>
                    <div className="opacity-90">{tNewUserOnboardModal("desc")}</div>

                    <div className="join join-vertical w-full">
                        <SectionWrap isOpen={stepIndex === 0} onClick={() => setStepIndex(0)}>
                            <SectionTitle showSuccess={profileStepComplete} title={tNewUserOnboardModal("section1.title")} />
                            <div className="collapse-content">
                                <div className="text-center font-semibold">{tNewUserOnboardModal("section1.desc")}</div>
                                <div className="mt-2 flex flex-wrap justify-center gap-2">
                                    <button
                                        className="btn btn-neutral btn-wide"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setProfileModalVisible(true);
                                        }}
                                    >
                                        {tCommon("updateProfile")}
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setStepIndex(1);
                                            if (!isUserInHomePage) {
                                                setModalVisible(false);
                                            }
                                        }}
                                    >
                                        {tCommon("skip")}
                                    </button>
                                </div>
                            </div>
                        </SectionWrap>
                        {isUserInHomePage && (
                            <>
                                <SectionWrap isOpen={stepIndex === 1} onClick={() => setStepIndex(1)}>
                                    <SectionTitle showSuccess={interests !== ""} title={tNewUserOnboardModal("section2.title")} />
                                    <div className="collapse-content">
                                        <div className="text-center font-semibold">{tNewUserOnboardModal("section2.desc")}</div>
                                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                                            <button
                                                className={clsx("btn btn-wide", interests === "buyer" ? "btn-neutral" : "btn-outline")}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setStepIndex(2);
                                                    setInterests("buyer");
                                                }}
                                            >
                                                {tNewUserOnboardModal("section2.buyingBtn")}
                                            </button>
                                            <button
                                                className={clsx("btn btn-wide", interests === "seller" ? "btn-neutral" : "btn-outline")}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setStepIndex(2);
                                                    setInterests("seller");
                                                }}
                                            >
                                                {tNewUserOnboardModal("section2.sellingBtn")}\{" "}
                                            </button>
                                        </div>
                                    </div>
                                </SectionWrap>

                                <SectionWrap
                                    isOpen={stepIndex === 2}
                                    onClick={() => {
                                        if (interests !== "") {
                                            setStepIndex(2);
                                        }
                                    }}
                                >
                                    <SectionTitle
                                        disabled={interests === ""}
                                        title={
                                            interests !== ""
                                                ? tNewUserOnboardModal("section3.title", { interests })
                                                : tNewUserOnboardModal("section3.titleWithoutInterest")
                                        }
                                    />
                                    <div className="collapse-content">
                                        <div className="mt-2 flex flex-col items-center gap-2">
                                            {interests === "buyer" && (
                                                <>
                                                    <RedirectLinks
                                                        btnTitle={tNewUserOnboardModal("section3.buyer.browseAdvertBtn")}
                                                        closeModal={() => setModalVisible(false)}
                                                        desc={tNewUserOnboardModal("section3.buyer.browseAdvertDesc")}
                                                        href="/search"
                                                    />
                                                    <div className="divider">{tCommon("or")}</div>
                                                    <RedirectLinks
                                                        btnTitle={tNewUserOnboardModal("section3.buyer.createSubscriptionBtn")}
                                                        closeModal={() => setModalVisible(false)}
                                                        desc={tNewUserOnboardModal("section3.buyer.createSubscriptionDesc")}
                                                        href="/dashboard/new-subscription"
                                                    />
                                                </>
                                            )}
                                            {interests === "seller" && (
                                                <>
                                                    <RedirectLinks
                                                        btnTitle={tNewUserOnboardModal("section3.seller.createAdvertBtn")}
                                                        closeModal={() => setModalVisible(false)}
                                                        desc={tNewUserOnboardModal("section3.seller.createAdvertDesc")}
                                                        href="/dashboard/new-listing"
                                                    />
                                                    <div className="divider">OR</div>
                                                    <RedirectLinks
                                                        btnTitle={tNewUserOnboardModal("section3.seller.browseAdvertBtn")}
                                                        closeModal={() => setModalVisible(false)}
                                                        desc={tNewUserOnboardModal("section3.seller.browseAdvertDesc")}
                                                        href="/search"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </SectionWrap>
                            </>
                        )}
                    </div>

                    <div className="mt-6 text-sm opacity-70">
                        {tNewUserOnboardModal("footer", {
                            contactUs: (
                                <LinkWithLocale
                                    className="link-hover link font-semibold text-neutral"
                                    href="/contact-us"
                                    onClick={() => setModalVisible(false)}
                                >
                                    {tNav("links.support.contactUs")}
                                </LinkWithLocale>
                            ),
                            FAQs: (
                                <LinkWithLocale
                                    className="link-hover link font-semibold text-neutral"
                                    href="/faqs"
                                    onClick={() => setModalVisible(false)}
                                >
                                    {tNav("links.support.faqs")}
                                </LinkWithLocale>
                            ),
                        })}
                    </div>
                </div>
            </Modal>

            {userData && (
                <ProfileUpdateModal
                    setVisible={setProfileModalVisible}
                    userData={userData}
                    visible={profileModalVisible}
                    onSuccess={() => {
                        setStepIndex(1);
                        setProfileStepComplete(true);
                        setProfileModalVisible(false);
                        if (!isUserInHomePage) {
                            setModalVisible(false);
                        }
                    }}
                />
            )}
        </>
    );
};
