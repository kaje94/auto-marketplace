"use client";
import { clsx } from "clsx";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react";
import React, { useCallback } from "react";
import { ListingItem as ListingItemType } from "targabay-protos/gen/ts/dist/types/common_pb";
import { LinkWithLocale, ListingItem } from "@/components/Common";
import { NextButton, PrevButton, usePrevNextButtons } from "./ListingsCarouselButtons";

type Props = {
    bgFromColor?: "from-white" | "from-base-200" | "from-hero";
    items?: ListingItemType[];
    loading?: boolean;
    loadingItemCount?: number;
    tinted?: boolean;
    viewMore?: {
        link: string;
        subTitle: string;
        title: string;
    };
};

export const ListingsCarousel = (props: Props) => {
    const { items = [], loading, loadingItemCount = 5, bgFromColor = "from-white", tinted, viewMore } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: false, axis: "x", containScroll: "trimSnaps" }, [Autoplay()]);

    const onButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
        const { autoplay } = emblaApi.plugins();
        if (!autoplay) return;
        if (autoplay.options.stopOnInteraction !== false) autoplay.stop();
    }, []);

    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi, onButtonClick);

    return (
        <div className={clsx("relative flex items-center", loading && "animate-pulse")}>
            <div className="rounded-box relative  flex-1 overflow-hidden px-2 py-5" ref={emblaRef}>
                <div className="flex h-auto flex-row gap-4">
                    {loading ? (
                        <>
                            {new Array(loadingItemCount).fill("").map((_, i) => (
                                <div
                                    key={`item-${i}`}
                                    className="relative w-[calc(75%)] min-w-0 flex-none sm:w-[calc(60%)] md:w-[calc(45%)] lg:w-[calc(38%)] xl:w-[calc(29%)] 2xl:w-[calc(23%)]"
                                >
                                    <ListingItem tinted={tinted} loading />
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {items?.map((item) => (
                                <div
                                    key={item.id}
                                    className={clsx(
                                        "rounded-box relative h-fit w-[calc(75%)] min-w-0 flex-none shadow duration-300  hover:shadow-lg sm:w-[calc(60%)] md:w-[calc(45%)] lg:w-[calc(38%)] xl:w-[calc(29%)] 2xl:w-[calc(23%)]",
                                        tinted && "hover:shadow-neutral",
                                    )}
                                >
                                    <ListingItem item={item} tinted={tinted} />
                                </div>
                            ))}
                            {viewMore && !loading && (
                                <div
                                    key="view-more"
                                    className={clsx(
                                        "rounded-box relative min-h-[200px] w-[calc(75%)] min-w-0 flex-none shadow  duration-300 hover:shadow-lg sm:w-[calc(60%)] md:w-[calc(45%)] lg:w-[calc(38%)] xl:w-[calc(29%)] 2xl:w-[calc(23%)]",
                                        tinted && "hover:shadow-neutral",
                                    )}
                                >
                                    <LinkWithLocale
                                        className={clsx({
                                            "card flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden  bg-opacity-70 p-7 shadow  transition duration-300 zoom-inner-image hover:bg-opacity-95 hover:shadow-lg md:p-10":
                                                true,
                                            "bg-neutral text-white opacity-95 hover:text-secondary": tinted,
                                            "bg-base-200 text-base-content  hover:text-neutral": !tinted,
                                        })}
                                        href={viewMore.link}
                                    >
                                        <div className="text-center text-2xl font-bold opacity-80 ">{viewMore.title}</div>
                                        <div className="text-center text-sm opacity-50">{viewMore.subTitle}</div>
                                    </LinkWithLocale>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {!loading && (
                <>
                    {!prevBtnDisabled && (
                        <span className="absolute left-4 top-8 z-10">
                            <PrevButton onClick={onPrevButtonClick} />
                        </span>
                    )}
                    {!nextBtnDisabled && (
                        <span className="absolute right-4 top-8 z-10">
                            <NextButton onClick={onNextButtonClick} />
                        </span>
                    )}
                </>
            )}

            <div
                className={clsx("absolute right-0 h-full w-8 bg-gradient-to-l to-transparent", nextBtnDisabled ? "from-transparent" : bgFromColor)}
            />
            <div className={clsx("absolute left-0 h-full w-8 bg-gradient-to-r to-transparent", prevBtnDisabled ? "from-transparent" : bgFromColor)} />
        </div>
    );
};
