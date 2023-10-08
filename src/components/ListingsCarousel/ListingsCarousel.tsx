"use client";
import { clsx } from "clsx";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react";
import React, { useCallback } from "react";
import { Empty, ListingItem } from "@/components/Common";
import { ListingItem as ListingItemType } from "@/utils/types";
import { NextButton, PrevButton, usePrevNextButtons } from "./ListingsCarouselButtons";

type Props = {
    bgFromColor?: "from-white" | "from-base-200" | "from-hero";
    emptyPlaceholderSubText?: string;
    emptyPlaceholderText?: string;
    items?: ListingItemType[];
    loading?: boolean;
    loadingItemCount?: number;
    showEmpty?: boolean;
    tinted?: boolean;
};

export const ListingsCarousel = (props: Props) => {
    const {
        items = [],
        loading,
        loadingItemCount = 5,
        bgFromColor = "from-white",
        emptyPlaceholderText = "No items to display",
        emptyPlaceholderSubText,
        showEmpty = true,
        tinted,
    } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false, axis: "x", containScroll: "trimSnaps" }, [Autoplay()]);

    const onButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
        const { autoplay } = emblaApi.plugins();
        if (!autoplay) return;
        if (autoplay.options.stopOnInteraction !== false) autoplay.stop();
    }, []);

    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi, onButtonClick);

    if (items?.length === 0 && !loading) {
        if (showEmpty) {
            return <Empty iconSize="sm" subText={emptyPlaceholderSubText} text={emptyPlaceholderText} />;
        } else {
            return null;
        }
    }

    return (
        <div className={clsx("relative flex items-center", loading && "animate-pulse")}>
            <div className="rounded-box relative  flex-1 overflow-hidden px-2 py-5" ref={emblaRef}>
                <div className="flex h-auto  flex-row gap-4">
                    {loading ? (
                        <>
                            {new Array(loadingItemCount).fill("").map((_, i) => (
                                <div
                                    key={`item-${i}`}
                                    className="relative w-[calc(75%)] min-w-0 flex-none sm:w-[calc(60%)] md:w-[calc(39%)] lg:w-[calc(27%)] 2xl:w-[calc(21%)]"
                                >
                                    <ListingItem loading tinted={tinted} />
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-box relative h-fit w-[calc(75%)] min-w-0 flex-none shadow duration-300 hover:shadow-lg hover:shadow-neutral sm:w-[calc(60%)] md:w-[calc(39%)] lg:w-[calc(27%)] 2xl:w-[calc(21%)]"
                                >
                                    <ListingItem item={item} tinted={tinted} />
                                </div>
                            ))}
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
