"use client";
import { Claims } from "@auth0/nextjs-auth0";
import { PartialMessage } from "@bufbuild/protobuf";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { useParams, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale, Modal } from "@/components/Common";
import { CheckCircleIcon } from "@/icons";

interface Props {
    /** Specifies whether the modal is initially visible. */
    initiallyVisible?: boolean;
    /** The claims of the user. */
    userClaims?: Claims;
    /** The data of the user. */
    userData?: PartialMessage<UserProfile>;
}

/** Lazily loaded profile update modal */
const ProfileUpdateModal = dynamic(() => import("../ProfileUpdateModal").then((mod) => mod.ProfileUpdateModal), { ssr: false });

/** Modal to be shown to first time users of webapp explaing them of the functionality and redirecting the to appropriate page */
export const NewUserOnboardModal = (props: Props) => {
    const { userClaims, userData, initiallyVisible = false } = props;
    const pathname = usePathname();
    const params = useParams();
    const [modalVisible, setModalVisible] = useState(initiallyVisible);
    const [stepIndex, setStepIndex] = useState(0);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [profileStepComplete, setProfileStepComplete] = useState(false);
    const [interests, setInterests] = useState<"buyer" | "seller" | "">("");

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
                    <div className={clsx("text-3xl xl:text-4xl", displayFont.className)}>Welcome {userData?.name}!</div>
                    <div className="opacity-90">
                        We&#39;re thrilled to have you on board and excited to help you find the perfect vehicle or connect with buyers if you&#39;re
                        selling.
                    </div>

                    <div className="join join-vertical w-full">
                        <SectionWrap isOpen={stepIndex === 0} onClick={() => setStepIndex(0)}>
                            <SectionTitle showSuccess={profileStepComplete} title="Set Up Your Profile" />
                            <div className="collapse-content">
                                <div className="text-center font-semibold">
                                    Before we begin, please take a moment to complete your profile details
                                </div>
                                <div className="mt-2 flex flex-wrap justify-center gap-2">
                                    <button
                                        className="btn btn-neutral btn-wide"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setProfileModalVisible(true);
                                        }}
                                    >
                                        Update Profile
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
                                        Skip
                                    </button>
                                </div>
                            </div>
                        </SectionWrap>
                        {isUserInHomePage && (
                            <>
                                <SectionWrap isOpen={stepIndex === 1} onClick={() => setStepIndex(1)}>
                                    <SectionTitle showSuccess={interests !== ""} title="Select Your Interests" />
                                    <div className="collapse-content">
                                        <div className="text-center font-semibold">Please let us know what you are interested in</div>
                                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                                            <button
                                                className={clsx("btn btn-wide", interests === "buyer" ? "btn-neutral" : "btn-outline")}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setStepIndex(2);
                                                    setInterests("buyer");
                                                }}
                                            >
                                                Buying a Vehicle
                                            </button>
                                            <button
                                                className={clsx("btn btn-wide", interests === "seller" ? "btn-neutral" : "btn-outline")}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setStepIndex(2);
                                                    setInterests("seller");
                                                }}
                                            >
                                                Selling a Vehicle
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
                                        title={`Begin Your Journey ${interests !== "" && `as a ${interests}`}`}
                                    />
                                    <div className="collapse-content">
                                        <div className="mt-2 flex flex-col items-center gap-2">
                                            {interests === "buyer" && (
                                                <>
                                                    <RedirectLinks
                                                        btnTitle="Browse adverts"
                                                        closeModal={() => setModalVisible(false)}
                                                        desc="Explore our extensive collection of verified vehicle advertisements"
                                                        href="/search"
                                                    />
                                                    <div className="divider">OR</div>
                                                    <RedirectLinks
                                                        btnTitle="Create subscriptions"
                                                        closeModal={() => setModalVisible(false)}
                                                        desc="Subscribe to advertisements that interest you and receive notifications whenever new listings match your
                                        preferences"
                                                        href="/dashboard/new-subscription"
                                                    />
                                                </>
                                            )}
                                            {interests === "seller" && (
                                                <>
                                                    <RedirectLinks
                                                        btnTitle="Create an Advert"
                                                        closeModal={() => setModalVisible(false)}
                                                        desc="Create an advert for your vehicle and watch it sell in no time!"
                                                        href="/dashboard/new-listing"
                                                    />
                                                    <div className="divider">OR</div>
                                                    <RedirectLinks
                                                        btnTitle="Browse adverts"
                                                        closeModal={() => setModalVisible(false)}
                                                        desc="Explore existing vehicle advertisements"
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
                        Got Questions? We&#39;re here to help. Check out our{" "}
                        <LinkWithLocale className="link-hover link font-semibold text-neutral" href="/faqs" onClick={() => setModalVisible(false)}>
                            FAQs
                        </LinkWithLocale>{" "}
                        or reach us out through our &#39;
                        <LinkWithLocale
                            className="link-hover link font-semibold text-neutral"
                            href="/contact-us"
                            onClick={() => setModalVisible(false)}
                        >
                            Contact Us
                        </LinkWithLocale>
                        &#39; page
                    </div>
                </div>
            </Modal>

            {userData && (
                <ProfileUpdateModal
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
                    onVisibleChange={setProfileModalVisible}
                />
            )}
        </>
    );
};

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
